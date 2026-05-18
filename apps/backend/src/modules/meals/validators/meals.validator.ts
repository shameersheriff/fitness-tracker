import { z } from 'zod';

export const mealTypeSchema = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);

export const createMealSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(800).optional(),
  mealType: mealTypeSchema,
  protein: z.coerce.number().nonnegative().default(0),
  carbs: z.coerce.number().nonnegative().default(0),
  fats: z.coerce.number().nonnegative().default(0),
  calories: z.coerce.number().int().nonnegative().default(0),
  fiber: z.coerce.number().nonnegative().optional(),
  sugar: z.coerce.number().nonnegative().optional(),
  sodium: z.coerce.number().nonnegative().optional(),
  mealDate: z.coerce.date(),
  favorite: z.boolean().default(false),
});

export const updateMealSchema = createMealSchema.partial();

export const mealQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
  mealType: mealTypeSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  favorite: z.coerce.boolean().optional(),
});
