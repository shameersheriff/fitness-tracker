import type { z } from 'zod';

import type {
  createMealEntrySchema,
  createMealSchema,
  mealDayQuerySchema,
  mealQuerySchema,
  updateMealSchema,
} from '../validators/meals.validator';

export type CreateMealDto = z.infer<typeof createMealSchema>;
export type UpdateMealDto = z.infer<typeof updateMealSchema>;
export type MealQueryDto = z.infer<typeof mealQuerySchema>;
export type MealDayQueryDto = z.infer<typeof mealDayQuerySchema>;
export type CreateMealEntryDto = z.infer<typeof createMealEntrySchema>;
