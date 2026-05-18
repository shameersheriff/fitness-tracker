import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';

interface RequestSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request['params'];
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request['query'];
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            'Validation failed',
            httpStatus.UNPROCESSABLE_ENTITY,
            error.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
          ),
        );
        return;
      }
      next(error);
    }
  };
}
