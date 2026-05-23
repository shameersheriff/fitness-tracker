import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '@/config/env';

declare global {
  namespace Express {
    interface Request {
      userContext: {
        userId?: string;
      };
    }
  }
}

export const userContext: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

  if (bearerToken) {
    try {
      const decoded = jwt.verify(bearerToken, env.JWT_SECRET);
      if (typeof decoded === 'object' && decoded !== null) {
        const jwtPayload = decoded as JwtPayload;
        req.userContext = {
          userId: typeof jwtPayload.sub === 'string' ? jwtPayload.sub : undefined,
        };
      } else {
        req.userContext = { userId: undefined };
      }
      next();
      return;
    } catch {
      req.userContext = { userId: undefined };
      next();
      return;
    }
  }

  const headerUserId = req.header('x-user-id');
  req.userContext = {
    userId: headerUserId && headerUserId.trim().length > 0 ? headerUserId : undefined,
  };
  next();
};
