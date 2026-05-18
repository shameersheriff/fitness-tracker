import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});
