import { z } from 'zod';

const sessionSetSchema = z.object({
  setNumber: z.coerce.number().int().positive(),
  reps: z.coerce.number().int().positive().optional(),
  weight: z.coerce.number().nonnegative().optional(),
  restTimeSeconds: z.coerce.number().int().nonnegative().optional(),
  durationSeconds: z.coerce.number().int().positive().optional(),
  distanceKm: z.coerce.number().positive().optional(),
  completed: z.boolean().default(false),
});

export const difficultySchema = z.enum(['VERY_EASY', 'EASY', 'MODERATE', 'HARD', 'MAX_EFFORT']);

export const createWorkoutSessionSchema = z.object({
  workoutId: z.string().min(1),
  scheduledWorkoutId: z.string().optional(),
  sessionDate: z.coerce.date().optional(),
  durationSeconds: z.coerce.number().int().positive().optional(),
  steps: z.coerce.number().int().nonnegative().optional(),
  distanceKm: z.coerce.number().positive().optional(),
  caloriesBurned: z.coerce.number().int().nonnegative().optional(),
  perceivedDifficulty: difficultySchema.optional(),
  energyLevel: z.coerce.number().int().min(1).max(10).optional(),
  notes: z.string().trim().max(1200).optional(),
  sets: z.array(sessionSetSchema).default([]),
});

export const addSessionSetSchema = z.object({
  reps: z.coerce.number().int().positive().optional(),
  weight: z.coerce.number().nonnegative().optional(),
  restTimeSeconds: z.coerce.number().int().nonnegative().optional(),
  durationSeconds: z.coerce.number().int().positive().optional(),
  distanceKm: z.coerce.number().positive().optional(),
  completed: z.boolean().default(false),
});

export const updateWorkoutSessionSchema = createWorkoutSessionSchema.partial();

export const workoutSessionQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  workoutId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
