import type { EquipmentType, MuscleGroup } from '@prisma/client';

export interface WorkoutFilters {
  userId?: string;
  search?: string;
  muscleGroup?: MuscleGroup;
  equipmentType?: EquipmentType;
  workoutTypeId?: string;
}
