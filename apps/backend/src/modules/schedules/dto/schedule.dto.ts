import type { z } from 'zod';

import type {
  createScheduledWorkoutSchema,
  scheduleQuerySchema,
  updateScheduledWorkoutSchema,
} from '../validators/schedules.validator';

export type CreateScheduledWorkoutDto = z.infer<typeof createScheduledWorkoutSchema>;
export type UpdateScheduledWorkoutDto = z.infer<typeof updateScheduledWorkoutSchema>;
export type ScheduleQueryDto = z.infer<typeof scheduleQuerySchema>;
