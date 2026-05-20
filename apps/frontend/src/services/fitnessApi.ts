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

import { deleteData, getData, sendData } from './apiClient';
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

const workoutsStorageKey = 'fitness-tracker:workouts';
const workoutTypesStorageKey = 'fitness-tracker:workout-types';

function readStoredWorkouts(): Workout[] {
  try {
    const raw = localStorage.getItem(workoutsStorageKey);

    if (!raw) {
      return [...demoWorkouts];
    }

    const parsed = JSON.parse(raw) as Workout[];
    return Array.isArray(parsed) ? parsed : [...demoWorkouts];
  } catch {
    return [...demoWorkouts];
  }
}

function writeStoredWorkouts(workouts: Workout[]) {
  try {
    localStorage.setItem(workoutsStorageKey, JSON.stringify(workouts));
  } catch {
    // Ignore storage write failures and keep app functional.
  }
}

function upsertStoredWorkout(workout: Workout) {
  const current = readStoredWorkouts();
  const existingIndex = current.findIndex((item) => item.id === workout.id);

  if (existingIndex === -1) {
    writeStoredWorkouts([workout, ...current]);
    return;
  }

  const updated = [...current];
  updated[existingIndex] = { ...updated[existingIndex], ...workout };
  writeStoredWorkouts(updated);
}

function removeStoredWorkout(id: string) {
  const current = readStoredWorkouts();
  writeStoredWorkouts(current.filter((item) => item.id !== id));
}

function readStoredWorkoutTypes(): WorkoutType[] {
  try {
    const raw = localStorage.getItem(workoutTypesStorageKey);

    if (!raw) {
      return [...demoWorkoutTypes];
    }

    const parsed = JSON.parse(raw) as WorkoutType[];
    return Array.isArray(parsed) ? parsed : [...demoWorkoutTypes];
  } catch {
    return [...demoWorkoutTypes];
  }
}

function writeStoredWorkoutTypes(workoutTypes: WorkoutType[]) {
  try {
    localStorage.setItem(workoutTypesStorageKey, JSON.stringify(workoutTypes));
  } catch {
    // Ignore storage write failures and keep app functional.
  }
}

function upsertStoredWorkoutType(workoutType: WorkoutType) {
  const current = readStoredWorkoutTypes();
  const existingIndex = current.findIndex((item) => item.id === workoutType.id);

  if (existingIndex === -1) {
    writeStoredWorkoutTypes([workoutType, ...current]);
    return;
  }

  const updated = [...current];
  updated[existingIndex] = { ...updated[existingIndex], ...workoutType };
  writeStoredWorkoutTypes(updated);
}

function removeStoredWorkoutType(id: string) {
  const current = readStoredWorkoutTypes();
  writeStoredWorkoutTypes(current.filter((item) => item.id !== id));
}

export const fitnessApi = {
  dashboard: {
    today: () => getData<DashboardToday>('/dashboard/today', demoDashboard),
    weeklySummary: () => getData<WeeklySummary>('/dashboard/weekly-summary', demoWeeklySummary),
  },
  workouts: {
    list: () => getData<Workout[]>('/workouts', readStoredWorkouts()),
    create: async (payload: Partial<Workout>) => {
      const workout = await sendData('/workouts', payload, {
        ...demoWorkouts[0],
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Workout);

      upsertStoredWorkout(workout);
      return workout;
    },
    update: async (id: string, payload: Partial<Workout>) => {
      const workout = await sendData(
        `/workouts/${id}`,
        payload,
        {
          ...demoWorkouts[0],
          ...payload,
          id,
          updatedAt: new Date().toISOString(),
        } as Workout,
        'put',
      );

      upsertStoredWorkout(workout);
      return workout;
    },
    remove: async (id: string) => {
      const deleted = await deleteData(`/workouts/${id}`);
      removeStoredWorkout(id);
      return deleted;
    },
  },
  workoutTypes: {
    list: () => getData<WorkoutType[]>('/workout-types', readStoredWorkoutTypes()),
    create: async (payload: Partial<WorkoutType>) => {
      const workoutType = await sendData('/workout-types', payload, {
        id: crypto.randomUUID(),
        name: payload.name ?? 'Custom Type',
        description: payload.description ?? null,
        trackingType: payload.trackingType ?? 'SETS_REPS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as WorkoutType);

      upsertStoredWorkoutType(workoutType);
      return workoutType;
    },
    update: async (id: string, payload: Partial<WorkoutType>) => {
      const workoutType = await sendData(
        `/workout-types/${id}`,
        payload,
        {
          id,
          name: payload.name ?? 'Updated Type',
          description: payload.description ?? null,
          trackingType: payload.trackingType ?? 'SETS_REPS',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as WorkoutType,
        'put',
      );

      upsertStoredWorkoutType(workoutType);
      return workoutType;
    },
    remove: async (id: string) => {
      const deleted = await deleteData(`/workout-types/${id}`);
      removeStoredWorkoutType(id);
      return deleted;
    },
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
