import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).optional(),
});
