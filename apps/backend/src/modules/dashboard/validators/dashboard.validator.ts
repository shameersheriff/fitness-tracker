import { z } from 'zod';

export const dashboardDateQuerySchema = z.object({
  date: z.coerce.date().optional(),
});
