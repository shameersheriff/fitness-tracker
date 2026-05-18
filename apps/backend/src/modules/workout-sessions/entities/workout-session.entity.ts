import type { DifficultyLevel } from '@prisma/client';

export interface WorkoutSessionEntity {
  id: string;
  userId?: string | null;
  workoutId: string;
  scheduledWorkoutId?: string | null;
  sessionDate: Date;
  perceivedDifficulty?: DifficultyLevel | null;
  completedAt?: Date | null;
}
