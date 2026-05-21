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

import { deleteData, deleteDataStrict, getDataStrict, sendDataStrict } from './apiClient';

export const fitnessApi = {
  dashboard: {
    today: () => getDataStrict<DashboardToday>('/dashboard/today'),
    weeklySummary: () => getDataStrict<WeeklySummary>('/dashboard/weekly-summary'),
  },
  workouts: {
    list: () => getDataStrict<Workout[]>('/workouts'),
    create: (payload: Partial<Workout>) =>
      sendDataStrict<Partial<Workout>, Workout>('/workouts', payload),
    update: (id: string, payload: Partial<Workout>) =>
      sendDataStrict<Partial<Workout>, Workout>(`/workouts/${id}`, payload, 'put'),
    remove: (id: string) => deleteData(`/workouts/${id}`),
  },
  workoutTypes: {
    list: () => getDataStrict<WorkoutType[]>('/workout-types'),
    create: (payload: Partial<WorkoutType>) =>
      sendDataStrict<Partial<WorkoutType>, WorkoutType>('/workout-types', payload),
    update: (id: string, payload: Partial<WorkoutType>) =>
      sendDataStrict<Partial<WorkoutType>, WorkoutType>(`/workout-types/${id}`, payload, 'put'),
    remove: (id: string) => deleteData(`/workout-types/${id}`),
  },
  schedules: {
    list: () => getDataStrict<ScheduledWorkout[]>('/schedules'),
    today: (date?: string) =>
      getDataStrict<ScheduledWorkout[]>(
        date ? `/schedules/day?date=${encodeURIComponent(date)}` : '/schedules/day',
      ),
    complete: (id: string) =>
      sendDataStrict<undefined, ScheduledWorkout>(`/schedules/${id}/complete`, undefined, 'patch'),
    reorderToday: (payload: { scheduleIds: string[] }) =>
      sendDataStrict<{ scheduleIds: string[] }, ScheduledWorkout[]>(
        '/schedules/day/reorder',
        payload,
        'patch',
      ),
    reorderByDate: (payload: { date: string; scheduleIds: string[] }) =>
      sendDataStrict<{ date: string; scheduleIds: string[] }, ScheduledWorkout[]>(
        '/schedules/reorder',
        payload,
        'patch',
      ),
    create: (payload: Partial<ScheduledWorkout>) =>
      sendDataStrict<Partial<ScheduledWorkout>, ScheduledWorkout>('/schedules', payload),
    remove: (id: string) => deleteData(`/schedules/${id}`),
  },
  sessions: {
    list: () => getDataStrict<WorkoutSession[]>('/workout-sessions'),
    create: (payload: Partial<WorkoutSession>) =>
      sendDataStrict<Partial<WorkoutSession>, WorkoutSession>('/workout-sessions', payload),
    addSet: (id: string, payload: Partial<WorkoutSession['sets'][number]>) =>
      sendDataStrict<Partial<WorkoutSession['sets'][number]>, WorkoutSession>(
        `/workout-sessions/${id}/sets`,
        payload,
      ),
    deleteSet: (id: string, setId: string) =>
      deleteDataStrict<WorkoutSession>(`/workout-sessions/${id}/sets/${setId}`),
    remove: (id: string) => deleteData(`/workout-sessions/${id}`),
  },
  meals: {
    list: () => getDataStrict<Meal[]>('/meals'),
    create: (payload: Partial<Meal>) => sendDataStrict<Partial<Meal>, Meal>('/meals', payload),
  },
  goals: {
    list: () => getDataStrict<NutritionGoal[]>('/goals'),
    create: (payload: Partial<NutritionGoal>) =>
      sendDataStrict<Partial<NutritionGoal>, NutritionGoal>('/goals', payload),
  },
  progress: {
    history: () => getDataStrict<BodyProgressEntry[]>('/progress/body/history'),
    createBodyEntry: (payload: Partial<BodyProgressEntry>) =>
      sendDataStrict<Partial<BodyProgressEntry>, BodyProgressEntry>('/progress/body', payload),
  },
  analytics: {
    workouts: () => getDataStrict<AnalyticsPoint[]>('/analytics/workouts'),
    nutrition: () => getDataStrict<AnalyticsPoint[]>('/analytics/nutrition'),
    progress: () => getDataStrict<AnalyticsPoint[]>('/analytics/progress'),
  },
};
