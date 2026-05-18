import type { RequestHandler } from 'express';

import { httpStatus } from '@/common/constants/httpStatus';

export const notFound: RequestHandler = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [],
  });
};
