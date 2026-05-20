import { z } from 'zod';

export const scheduleStatusSchema = z.enum(['PLANNED', 'COMPLETED', 'SKIPPED']);

export const createScheduledWorkoutSchema = z.object({
  workoutId: z.string().min(1),
  scheduledDate: z.coerce.date(),
  position: z.coerce.number().int().positive().default(1),
  targetSets: z.coerce.number().int().positive().optional(),
  targetReps: z.coerce.number().int().positive().optional(),
  targetWeight: z.coerce.number().positive().optional(),
  targetDurationSeconds: z.coerce.number().int().positive().optional(),
  targetDistanceKm: z.coerce.number().positive().optional(),
  recurrenceRule: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(1200).optional(),
});

export const updateScheduledWorkoutSchema = createScheduledWorkoutSchema
  .partial()
  .extend({ status: scheduleStatusSchema.optional() });

export const scheduleQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  status: scheduleStatusSchema.optional(),
});
