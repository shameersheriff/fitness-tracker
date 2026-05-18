import type { Response } from 'express';

import type { PaginationMeta } from '@fitness-tracker/shared-types';

export function ok<TData>(res: Response, message: string, data: TData) {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}

export function created<TData>(res: Response, message: string, data: TData) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function noContent(res: Response) {
  return res.status(204).send();
}

export function paginated<TData>(
  res: Response,
  message: string,
  data: TData[],
  meta: PaginationMeta,
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
}
