import { z } from 'zod';

export const muscleGroupSchema = z.enum([
  'CHEST',
  'BACK',
  'LEGS',
  'SHOULDERS',
  'ARMS',
  'CORE',
  'CARDIO',
  'FULL_BODY',
]);

export const equipmentTypeSchema = z.enum([
  'BARBELL',
  'DUMBBELL',
  'MACHINE',
  'CABLE',
  'BODYWEIGHT',
  'RESISTANCE_BAND',
  'KETTLEBELL',
  'NONE',
]);

export const createWorkoutSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(800).optional(),
  instructions: z.string().trim().max(3000).optional(),
  tips: z.string().trim().max(1200).optional(),
  notes: z.string().trim().max(1200).optional(),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  muscleGroup: muscleGroupSchema,
  equipmentType: equipmentTypeSchema,
  workoutTypeId: z.string().optional(),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

export const workoutQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
  muscleGroup: muscleGroupSchema.optional(),
  equipmentType: equipmentTypeSchema.optional(),
  workoutTypeId: z.string().optional(),
});
