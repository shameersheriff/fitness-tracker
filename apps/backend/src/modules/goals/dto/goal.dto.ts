import type { z } from 'zod';

import type {
  createNutritionGoalSchema,
  goalsQuerySchema,
  updateNutritionGoalSchema,
} from '../validators/goals.validator';

export type CreateNutritionGoalDto = z.infer<typeof createNutritionGoalSchema>;
export type UpdateNutritionGoalDto = z.infer<typeof updateNutritionGoalSchema>;
export type GoalsQueryDto = z.infer<typeof goalsQuerySchema>;
