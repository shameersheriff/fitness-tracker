import type { PaginationMeta } from '@fitness-tracker/shared-types';

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export function getPagination(input: PaginationInput) {
  const page = Math.max(Number(input.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(input.limit ?? 20), 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
}
