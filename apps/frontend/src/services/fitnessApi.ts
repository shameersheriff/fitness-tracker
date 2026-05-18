import type {
  AnalyticsPoint,
  BodyProgressEntry,
  DashboardToday,
  Meal,
  NutritionGoal,
  ScheduledWorkout,
  WeeklySummary,
  Workout,
  WorkoutSession,
  WorkoutType,
} from '@fitness-tracker/shared-types';

import { getData, sendData } from './apiClient';
import {
  demoDashboard,
  demoMeals,
  demoNutritionAnalytics,
  demoNutritionGoal,
  demoProgress,
  demoScheduledWorkouts,
  demoSessions,
  demoWeeklySummary,
  demoWorkoutAnalytics,
  demoWorkouts,
  demoWorkoutTypes,
} from './demoData';

export const fitnessApi = {
  dashboard: {
    today: () => getData<DashboardToday>('/dashboard/today', demoDashboard),
    weeklySummary: () => getData<WeeklySummary>('/dashboard/weekly-summary', demoWeeklySummary),
  },
  workouts: {
    list: () => getData<Workout[]>('/workouts', demoWorkouts),
    create: (payload: Partial<Workout>) =>
      sendData('/workouts', payload, {
        ...demoWorkouts[0],
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Workout),
  },
  workoutTypes: {
    list: () => getData<WorkoutType[]>('/workout-types', demoWorkoutTypes),
  },
  schedules: {
    list: () => getData<ScheduledWorkout[]>('/schedules', demoScheduledWorkouts),
    today: (date: string) => getData<ScheduledWorkout[]>(`/schedules/day/${date}`, demoScheduledWorkouts),
  },
  sessions: {
    list: () => getData<WorkoutSession[]>('/workout-sessions', demoSessions),
  },
  meals: {
    list: () => getData<Meal[]>('/meals', demoMeals),
  },
  goals: {
    list: () => getData<NutritionGoal[]>('/goals', [demoNutritionGoal]),
  },
  progress: {
    history: () => getData<BodyProgressEntry[]>('/progress/body/history', demoProgress),
  },
  analytics: {
    workouts: () => getData<AnalyticsPoint[]>('/analytics/workouts', demoWorkoutAnalytics),
    nutrition: () => getData<AnalyticsPoint[]>('/analytics/nutrition', demoNutritionAnalytics),
    progress: () =>
      getData<AnalyticsPoint[]>(
        '/analytics/progress',
        demoProgress.map((point) => ({
          label: new Date(point.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: point.bodyWeight ?? 0,
        })),
      ),
  },
};
