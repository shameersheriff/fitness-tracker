import bcrypt from 'bcryptjs';

import { httpStatus } from '@/common/constants/httpStatus';
import { prisma } from '@/common/database/prisma';
import { AppError } from '@/common/errors/AppError';

import type { UpdatePasswordDto } from '../dto/settings.dto';
import { SettingsRepository } from '../repositories/settings.repository';

export class SettingsService {
  constructor(private readonly repository = new SettingsRepository()) {}

  async get(userId?: string) {
    const settings = await this.repository.get(userId);
    if (settings) {
      return {
        ...settings,
        notificationPreferences: JSON.parse(settings.notificationPreferences) as Record<
          string,
          boolean
        >,
      };
    }

    return {
      id: 'default',
      userId,
      theme: 'system',
      unitSystem: 'IMPERIAL',
      distanceUnit: 'MI',
      notificationPreferences: {
        workouts: true,
        meals: true,
        water: true,
        sleep: true,
        weighIns: true,
      },
      weekStartDay: 'MONDAY',
    };
  }

  async update(data: Parameters<SettingsRepository['upsert']>[0], userId?: string) {
    const settings = await this.repository.upsert(data, userId);
    return {
      ...settings,
      notificationPreferences: JSON.parse(settings.notificationPreferences) as Record<
        string,
        boolean
      >,
    };
  }

  async updatePassword(data: UpdatePasswordDto, userId?: string) {
    if (!userId) {
      throw new AppError('Authentication required', httpStatus.UNAUTHORIZED);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) {
      throw new AppError('Current password is incorrect', httpStatus.BAD_REQUEST);
    }

    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', httpStatus.BAD_REQUEST);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { updated: true };
  }
}
