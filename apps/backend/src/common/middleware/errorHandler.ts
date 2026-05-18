import type { ErrorRequestHandler } from 'express';

import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { logger } from '@/common/logger/logger';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  logger.error('Unhandled API error', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    errors: [],
  });
};
