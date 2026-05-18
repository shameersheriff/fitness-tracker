import type {
  DifficultyLevel,
  EquipmentType,
  GoalType,
  MealType,
  MuscleGroup,
  ScheduleStatus,
  ThemePreference,
  TrackingType,
} from './enums';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel?: string;
  goalType?: GoalType;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutType {
  id: string;
  name: string;
  description?: string | null;
  trackingType: TrackingType;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  tips?: string | null;
  notes?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  workoutTypeId?: string | null;
  workoutType?: WorkoutType | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledWorkout {
  id: string;
  workoutId: string;
  workout?: Workout;
  scheduledDate: string;
  position: number;
  targetSets?: number | null;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetDurationSeconds?: number | null;
  targetDistanceKm?: number | null;
  recurrenceRule?: string | null;
  status: ScheduleStatus;
  completedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSessionSet {
  id: string;
  setNumber: number;
  reps?: number | null;
  weight?: number | null;
  restTimeSeconds?: number | null;
  durationSeconds?: number | null;
  distanceKm?: number | null;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  scheduledWorkoutId?: string | null;
  workout?: Workout;
  sessionDate: string;
  durationSeconds?: number | null;
  steps?: number | null;
  distanceKm?: number | null;
  caloriesBurned?: number | null;
  perceivedDifficulty?: DifficultyLevel | null;
  energyLevel?: number | null;
  notes?: string | null;
  completedAt?: string | null;
  sets: WorkoutSessionSet[];
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  title: string;
  description?: string | null;
  mealType: MealType;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  mealDate: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionGoal {
  id: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterMl: number;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}

export interface BodyProgressEntry {
  id: string;
  entryDate: string;
  bodyWeight?: number | null;
  waist?: number | null;
  chest?: number | null;
  arms?: number | null;
  thighs?: number | null;
  hips?: number | null;
  bodyFatPercentage?: number | null;
  photoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  logDate: string;
  waterMl?: number | null;
  sleepHours?: number | null;
  steps?: number | null;
  mood?: string | null;
  soreness?: number | null;
  energyLevel?: number | null;
}

export interface UserSettings {
  id: string;
  theme: ThemePreference;
  unitSystem: 'METRIC' | 'IMPERIAL';
  distanceUnit: 'KM' | 'MI';
  notificationPreferences: Record<string, boolean>;
  weekStartDay: 'MONDAY' | 'SUNDAY';
}
