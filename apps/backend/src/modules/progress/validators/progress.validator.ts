import { z } from 'zod';

export const createBodyProgressSchema = z.object({
  entryDate: z.coerce.date().optional(),
  bodyWeight: z.coerce.number().positive().optional(),
  waist: z.coerce.number().positive().optional(),
  chest: z.coerce.number().positive().optional(),
  arms: z.coerce.number().positive().optional(),
  thighs: z.coerce.number().positive().optional(),
  hips: z.coerce.number().positive().optional(),
  bodyFatPercentage: z.coerce.number().min(1).max(80).optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().trim().max(1200).optional(),
});

export const progressHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
