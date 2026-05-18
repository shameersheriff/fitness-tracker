import type { ScheduleStatus } from '@prisma/client';

export interface ScheduledWorkoutEntity {
  id: string;
  userId?: string | null;
  workoutId: string;
  scheduledDate: Date;
  position: number;
  status: ScheduleStatus;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
