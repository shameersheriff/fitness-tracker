import { z } from 'zod';

export const trackingTypeSchema = z.enum(['SETS_REPS', 'TIME', 'STEPS', 'DISTANCE']);

export const createWorkoutTypeSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  trackingType: trackingTypeSchema,
});

export const updateWorkoutTypeSchema = createWorkoutTypeSchema.partial();

export const workoutTypeQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
  trackingType: trackingTypeSchema.optional(),
});
