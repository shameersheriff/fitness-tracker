import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { prisma } from '@/common/database/prisma';
import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { env } from '@/config/env';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

interface AuthPayload {
  token: string;
  user: AuthUser;
}

export class AuthService {
  private toAuthUser(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
  }): AuthUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private signToken(user: { id: string; email: string }) {
    const signOptions: SignOptions = {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    return jwt.sign({ email: user.email }, env.JWT_SECRET, signOptions);
  }

  async register(input: RegisterInput): Promise<AuthPayload> {
    const normalizedEmail = input.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', httpStatus.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      token: this.signToken({ id: createdUser.id, email: createdUser.email }),
      user: this.toAuthUser(createdUser),
    };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const normalizedEmail = input.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        passwordHash: true,
        deletedAt: true,
      },
    });

    const isPasswordValid = user?.passwordHash
      ? await bcrypt.compare(input.password, user.passwordHash)
      : false;

    if (!user || user.deletedAt || !isPasswordValid) {
      throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token: this.signToken({ id: user.id, email: user.email }),
      user: this.toAuthUser(user),
    };
  }

  async me(userId?: string): Promise<AuthUser> {
    if (!userId) {
      throw new AppError('Authentication required', httpStatus.UNAUTHORIZED);
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    return this.toAuthUser(user);
  }
}
