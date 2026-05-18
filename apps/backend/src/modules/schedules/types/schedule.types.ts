import type { ScheduleStatus } from '@prisma/client';

export interface ScheduleFilters {
  userId?: string;
  from?: Date;
  to?: Date;
  status?: ScheduleStatus;
}
