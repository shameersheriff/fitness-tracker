import type { z } from 'zod';

import type {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutQuerySchema,
} from '../validators/workouts.validator';

export type CreateWorkoutDto = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutDto = z.infer<typeof updateWorkoutSchema>;
export type WorkoutQueryDto = z.infer<typeof workoutQuerySchema>;
