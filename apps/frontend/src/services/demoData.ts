import {
  type AnalyticsPoint,
  type BodyProgressEntry,
  type DashboardToday,
  type Meal,
  type NutritionGoal,
  type ScheduledWorkout,
  type WeeklySummary,
  type Workout,
  type WorkoutSession,
  type WorkoutType,
} from '@fitness-tracker/shared-types';

const now = new Date().toISOString();

export const demoWorkoutTypes: WorkoutType[] = [
  {
    id: 'type-strength',
    name: 'Strength',
    description: 'Heavy compound lifts with progressive loading.',
    trackingType: 'SETS_REPS',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'type-cardio',
    name: 'Cardio',
    description: 'Running, cycling, and zone-based conditioning.',
    trackingType: 'TIME',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'type-mobility',
    name: 'Mobility',
    description: 'Movement quality, recovery, and range of motion.',
    trackingType: 'TIME',
    createdAt: now,
    updatedAt: now,
  },
];

export const demoWorkouts: Workout[] = [
  {
    id: 'workout-bench',
    name: 'Bench Press',
    description: 'Primary chest strength movement.',
    instructions: 'Keep shoulder blades pinned and press from a stable base.',
    muscleGroup: 'CHEST',
    equipmentType: 'BARBELL',
    workoutTypeId: 'type-strength',
    workoutType: demoWorkoutTypes[0],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'workout-squat',
    name: 'Back Squat',
    description: 'Lower-body strength and volume anchor.',
    instructions: 'Brace, sit between the hips, and drive through midfoot.',
    muscleGroup: 'LEGS',
    equipmentType: 'BARBELL',
    workoutTypeId: 'type-strength',
    workoutType: demoWorkoutTypes[0],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'workout-run',
    name: 'Zone 2 Run',
    description: 'Aerobic base run with steady breathing.',
    instructions: 'Stay conversational and cap intensity early.',
    muscleGroup: 'CARDIO',
    equipmentType: 'NONE',
    workoutTypeId: 'type-cardio',
    workoutType: demoWorkoutTypes[1],
    createdAt: now,
    updatedAt: now,
  },
];

export const demoScheduledWorkouts: ScheduledWorkout[] = [
  {
    id: 'schedule-1',
    workoutId: 'workout-bench',
    workout: demoWorkouts[0],
    scheduledDate: now,
    position: 1,
    targetSets: 4,
    targetReps: 8,
    targetWeight: 185,
    status: 'PLANNED',
    notes: 'Last set RPE 8.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'schedule-2',
    workoutId: 'workout-squat',
    workout: demoWorkouts[1],
    scheduledDate: now,
    position: 2,
    targetSets: 5,
    targetReps: 5,
    targetWeight: 245,
    status: 'COMPLETED',
    completedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'schedule-3',
    workoutId: 'workout-run',
    workout: demoWorkouts[2],
    scheduledDate: now,
    position: 3,
    targetDurationSeconds: 1800,
    targetDistanceKm: 5,
    status: 'PLANNED',
    createdAt: now,
    updatedAt: now,
  },
];

export const demoMeals: Meal[] = [
  {
    id: 'meal-1',
    title: 'Greek Yogurt Bowl',
    description: 'Greek yogurt, berries, oats, honey.',
    mealType: 'BREAKFAST',
    protein: 42,
    carbs: 58,
    fats: 12,
    calories: 505,
    fiber: 8,
    sugar: 22,
    sodium: 170,
    mealDate: now,
    favorite: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'meal-2',
    title: 'Chicken Rice Plate',
    description: 'Chicken breast, jasmine rice, avocado, salsa.',
    mealType: 'LUNCH',
    protein: 56,
    carbs: 72,
    fats: 21,
    calories: 701,
    fiber: 9,
    sugar: 7,
    sodium: 610,
    mealDate: now,
    favorite: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoNutritionGoal: NutritionGoal = {
  id: 'goal-1',
  dailyCalories: 2600,
  protein: 190,
  carbs: 285,
  fats: 82,
  waterMl: 3200,
  effectiveFrom: now,
  createdAt: now,
  updatedAt: now,
};

export const demoProgress: BodyProgressEntry[] = [
  {
    id: 'progress-1',
    entryDate: '2026-05-10T12:00:00.000Z',
    bodyWeight: 184.8,
    waist: 33.8,
    chest: 42,
    arms: 15.4,
    thighs: 24.6,
    hips: 39.4,
    bodyFatPercentage: 17.8,
    createdAt: now,
  },
  {
    id: 'progress-2',
    entryDate: '2026-05-17T12:00:00.000Z',
    bodyWeight: 183.6,
    waist: 33.5,
    chest: 42.1,
    arms: 15.5,
    thighs: 24.7,
    hips: 39.2,
    bodyFatPercentage: 17.2,
    createdAt: now,
  },
];

export const demoDashboard: DashboardToday = {
  date: now,
  workouts: demoScheduledWorkouts,
  completedWorkouts: 1,
  remainingWorkouts: 2,
  meals: demoMeals,
  macros: {
    calories: 1206,
    protein: 98,
    carbs: 130,
    fats: 33,
    fiber: 17,
    sugar: 29,
    sodium: 780,
  },
  nutritionGoal: demoNutritionGoal,
  latestProgress: demoProgress[1],
  workoutStreak: 5,
};

export const demoWeeklySummary: WeeklySummary = {
  startDate: '2026-05-11T00:00:00.000Z',
  endDate: '2026-05-17T23:59:59.000Z',
  scheduledWorkouts: 9,
  completedWorkouts: 7,
  completionRate: 78,
  caloriesConsumed: 16850,
  proteinConsumed: 1185,
  workoutVolume: 42850,
};

export const demoSessions: WorkoutSession[] = [
  {
    id: 'session-1',
    workoutId: 'workout-squat',
    workout: demoWorkouts[1],
    sessionDate: now,
    perceivedDifficulty: 'HARD',
    energyLevel: 8,
    completedAt: now,
    notes: 'Good bar speed through first four sets.',
    sets: [
      { id: 'set-1', setNumber: 1, reps: 5, weight: 225, restTimeSeconds: 120, completed: true },
      { id: 'set-2', setNumber: 2, reps: 5, weight: 245, restTimeSeconds: 150, completed: true },
      { id: 'set-3', setNumber: 3, reps: 5, weight: 245, restTimeSeconds: 150, completed: true },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

export const demoWorkoutAnalytics: AnalyticsPoint[] = [
  { label: 'Chest', value: 7 },
  { label: 'Back', value: 6 },
  { label: 'Legs', value: 8 },
  { label: 'Cardio', value: 4 },
  { label: 'Core', value: 3 },
];

export const demoNutritionAnalytics: AnalyticsPoint[] = [
  { label: 'Mon', value: 2380 },
  { label: 'Tue', value: 2550 },
  { label: 'Wed', value: 2615 },
  { label: 'Thu', value: 2495 },
  { label: 'Fri', value: 2660 },
  { label: 'Sat', value: 2725 },
  { label: 'Sun', value: 2425 },
];
