import type { z } from 'zod';

import type {
  createWorkoutTypeSchema,
  updateWorkoutTypeSchema,
  workoutTypeQuerySchema,
} from '../validators/workout-types.validator';

export type CreateWorkoutTypeDto = z.infer<typeof createWorkoutTypeSchema>;
export type UpdateWorkoutTypeDto = z.infer<typeof updateWorkoutTypeSchema>;
export type WorkoutTypeQueryDto = z.infer<typeof workoutTypeQuerySchema>;
