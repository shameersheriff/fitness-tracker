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
    create: (payload: Partial<WorkoutType>) =>
      sendData('/workout-types', payload, {
        id: crypto.randomUUID(),
        name: payload.name ?? 'Custom Type',
        description: payload.description ?? null,
        trackingType: payload.trackingType ?? 'SETS_REPS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as WorkoutType),
  },
  schedules: {
    list: () => getData<ScheduledWorkout[]>('/schedules', demoScheduledWorkouts),
    today: (date: string) =>
      getData<ScheduledWorkout[]>(`/schedules/day/${date}`, demoScheduledWorkouts),
    create: (payload: Partial<ScheduledWorkout>) => {
      const workout = demoWorkouts.find((item) => item.id === payload.workoutId) ?? demoWorkouts[0];
      const workoutId = payload.workoutId ?? workout?.id ?? 'workout-custom';
      return sendData('/schedules', payload, {
        id: crypto.randomUUID(),
        workoutId,
        workout,
        scheduledDate: payload.scheduledDate ?? new Date().toISOString(),
        position: payload.position ?? 1,
        targetSets: payload.targetSets ?? null,
        targetReps: payload.targetReps ?? null,
        targetWeight: payload.targetWeight ?? null,
        targetDurationSeconds: payload.targetDurationSeconds ?? null,
        targetDistanceKm: payload.targetDistanceKm ?? null,
        recurrenceRule: payload.recurrenceRule ?? null,
        status: payload.status ?? 'PLANNED',
        completedAt: null,
        notes: payload.notes ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ScheduledWorkout);
    },
  },
  sessions: {
    list: () => getData<WorkoutSession[]>('/workout-sessions', demoSessions),
    create: (payload: Partial<WorkoutSession>) => {
      const workout = demoWorkouts.find((item) => item.id === payload.workoutId) ?? demoWorkouts[0];
      const workoutId = payload.workoutId ?? workout?.id ?? 'workout-custom';
      return sendData('/workout-sessions', payload, {
        id: crypto.randomUUID(),
        workoutId,
        scheduledWorkoutId: payload.scheduledWorkoutId ?? null,
        workout,
        sessionDate: payload.sessionDate ?? new Date().toISOString(),
        durationSeconds: payload.durationSeconds ?? null,
        steps: payload.steps ?? null,
        distanceKm: payload.distanceKm ?? null,
        caloriesBurned: payload.caloriesBurned ?? null,
        perceivedDifficulty: payload.perceivedDifficulty ?? 'MODERATE',
        energyLevel: payload.energyLevel ?? null,
        notes: payload.notes ?? null,
        completedAt: payload.completedAt ?? null,
        sets: payload.sets ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as WorkoutSession);
    },
  },
  meals: {
    list: () => getData<Meal[]>('/meals', demoMeals),
    create: (payload: Partial<Meal>) =>
      sendData('/meals', payload, {
        id: crypto.randomUUID(),
        title: payload.title ?? 'New Meal',
        description: payload.description ?? null,
        mealType: payload.mealType ?? 'BREAKFAST',
        protein: payload.protein ?? 0,
        carbs: payload.carbs ?? 0,
        fats: payload.fats ?? 0,
        calories: payload.calories ?? 0,
        fiber: payload.fiber ?? null,
        sugar: payload.sugar ?? null,
        sodium: payload.sodium ?? null,
        mealDate: payload.mealDate ?? new Date().toISOString(),
        favorite: payload.favorite ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Meal),
  },
  goals: {
    list: () => getData<NutritionGoal[]>('/goals', [demoNutritionGoal]),
    create: (payload: Partial<NutritionGoal>) =>
      sendData('/goals', payload, {
        id: crypto.randomUUID(),
        dailyCalories: payload.dailyCalories ?? 0,
        protein: payload.protein ?? 0,
        carbs: payload.carbs ?? 0,
        fats: payload.fats ?? 0,
        waterMl: payload.waterMl ?? 0,
        effectiveFrom: payload.effectiveFrom ?? new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as NutritionGoal),
  },
  progress: {
    history: () => getData<BodyProgressEntry[]>('/progress/body/history', demoProgress),
    createBodyEntry: (payload: Partial<BodyProgressEntry>) =>
      sendData('/progress/body', payload, {
        id: crypto.randomUUID(),
        entryDate: payload.entryDate ?? new Date().toISOString(),
        bodyWeight: payload.bodyWeight ?? null,
        waist: payload.waist ?? null,
        chest: payload.chest ?? null,
        arms: payload.arms ?? null,
        thighs: payload.thighs ?? null,
        hips: payload.hips ?? null,
        bodyFatPercentage: payload.bodyFatPercentage ?? null,
        photoUrl: payload.photoUrl ?? null,
        notes: payload.notes ?? null,
        createdAt: new Date().toISOString(),
      } as BodyProgressEntry),
  },
  analytics: {
    workouts: () => getData<AnalyticsPoint[]>('/analytics/workouts', demoWorkoutAnalytics),
    nutrition: () => getData<AnalyticsPoint[]>('/analytics/nutrition', demoNutritionAnalytics),
    progress: () =>
      getData<AnalyticsPoint[]>(
        '/analytics/progress',
        demoProgress.map((point) => ({
          label: new Date(point.entryDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          value: point.bodyWeight ?? 0,
        })),
      ),
  },
};
