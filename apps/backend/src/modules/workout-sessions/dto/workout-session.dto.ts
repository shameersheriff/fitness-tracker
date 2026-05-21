import type { z } from 'zod';

import type {
  addSessionSetSchema,
  createWorkoutSessionSchema,
  updateWorkoutSessionSchema,
  workoutSessionQuerySchema,
} from '../validators/workout-sessions.validator';

export type CreateWorkoutSessionDto = z.infer<typeof createWorkoutSessionSchema>;
export type UpdateWorkoutSessionDto = z.infer<typeof updateWorkoutSessionSchema>;
export type WorkoutSessionQueryDto = z.infer<typeof workoutSessionQuerySchema>;
export type AddSessionSetDto = z.infer<typeof addSessionSetSchema>;
