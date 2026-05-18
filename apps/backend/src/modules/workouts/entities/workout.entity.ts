import type { EquipmentType, MuscleGroup } from '@prisma/client';

export interface WorkoutEntity {
  id: string;
  userId?: string | null;
  workoutTypeId?: string | null;
  name: string;
  description?: string | null;
  instructions?: string | null;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  createdAt: Date;
  updatedAt: Date;
}
