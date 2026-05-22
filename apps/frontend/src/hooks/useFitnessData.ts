import { useQuery } from '@tanstack/react-query';

import { fitnessApi } from '@/services/fitnessApi';

export function useDashboardToday() {
  return useQuery({
    queryKey: ['dashboard', 'today'],
    queryFn: fitnessApi.dashboard.today,
  });
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: ['dashboard', 'weekly-summary'],
    queryFn: fitnessApi.dashboard.weeklySummary,
  });
}

export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: fitnessApi.workouts.list,
  });
}

export function useWorkoutTypes() {
  return useQuery({
    queryKey: ['workout-types'],
    queryFn: fitnessApi.workoutTypes.list,
  });
}

export function useSchedules(filters?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['schedules', filters?.from ?? null, filters?.to ?? null],
    queryFn: () => fitnessApi.schedules.list(filters),
  });
}

export function useTodaySchedules(date?: string) {
  return useQuery({
    queryKey: ['schedules', 'day', date ?? 'today'],
    queryFn: () => fitnessApi.schedules.today(date),
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ['workout-sessions'],
    queryFn: fitnessApi.sessions.list,
  });
}

export function useMeals() {
  return useQuery({
    queryKey: ['meals'],
    queryFn: fitnessApi.meals.list,
  });
}

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: fitnessApi.goals.list,
  });
}

export function useProgressHistory() {
  return useQuery({
    queryKey: ['progress', 'body'],
    queryFn: fitnessApi.progress.history,
  });
}

export function useWorkoutAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'workouts'],
    queryFn: fitnessApi.analytics.workouts,
  });
}

export function useNutritionAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'nutrition'],
    queryFn: fitnessApi.analytics.nutrition,
  });
}

export function useProgressAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'progress'],
    queryFn: fitnessApi.analytics.progress,
  });
}
