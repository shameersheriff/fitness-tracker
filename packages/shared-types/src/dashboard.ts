import type { BodyProgressEntry, MealEntry, NutritionGoal, ScheduledWorkout } from './domain';

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface DashboardToday {
  date: string;
  workouts: ScheduledWorkout[];
  completedWorkouts: number;
  remainingWorkouts: number;
  meals: MealEntry[];
  macros: MacroTotals;
  nutritionGoal?: NutritionGoal | null;
  latestProgress?: BodyProgressEntry | null;
  workoutStreak: number;
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  scheduledWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
  caloriesConsumed: number;
  proteinConsumed: number;
  workoutVolume: number;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}
