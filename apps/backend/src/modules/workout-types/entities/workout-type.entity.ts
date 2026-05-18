import type { TrackingType } from '@prisma/client';

export interface WorkoutTypeEntity {
  id: string;
  userId?: string | null;
  name: string;
  description?: string | null;
  trackingType: TrackingType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
