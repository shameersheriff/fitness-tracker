export interface WorkoutTypeFilters {
  userId?: string;
  search?: string;
  trackingType?: 'SETS_REPS' | 'TIME' | 'STEPS' | 'DISTANCE';
}
