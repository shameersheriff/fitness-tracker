import type { RequestHandler } from 'express';

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
  const headerUserId = req.header('x-user-id');
  req.userContext = {
    userId: headerUserId && headerUserId.trim().length > 0 ? headerUserId : undefined,
  };
  next();
};
