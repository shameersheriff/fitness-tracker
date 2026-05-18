import { httpStatus } from '@/common/constants/httpStatus';

export class AppError extends Error {
  readonly statusCode: number;
  readonly errors: Array<{ field?: string; message: string; code?: string }>;
  readonly isOperational = true;

  constructor(
    message: string,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    errors: Array<{ field?: string; message: string; code?: string }> = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
