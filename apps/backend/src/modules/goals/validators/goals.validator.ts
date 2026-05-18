import { z } from 'zod';

export const createNutritionGoalSchema = z.object({
  dailyCalories: z.coerce.number().int().positive(),
  protein: z.coerce.number().nonnegative(),
  carbs: z.coerce.number().nonnegative(),
  fats: z.coerce.number().nonnegative(),
  waterMl: z.coerce.number().int().positive(),
  effectiveFrom: z.coerce.date().optional(),
});

export const updateNutritionGoalSchema = createNutritionGoalSchema.partial();

export const goalsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
