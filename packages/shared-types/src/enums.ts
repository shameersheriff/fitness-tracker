export const goalTypes = ['FAT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'STRENGTH_GAIN'] as const;
export type GoalType = (typeof goalTypes)[number];

export const trackingTypes = ['SETS_REPS', 'TIME', 'STEPS', 'DISTANCE'] as const;
export type TrackingType = (typeof trackingTypes)[number];

export const muscleGroups = [
  'CHEST',
  'BACK',
  'LEGS',
  'QUADS',
  'HAMSTRINGS',
  'GLUTES',
  'CALVES',
  'SHOULDERS',
  'ARMS',
  'BICEPS',
  'TRICEPS',
  'FOREARMS',
  'CORE',
  'CARDIO',
  'FULL_BODY',
] as const;
export type MuscleGroup = (typeof muscleGroups)[number];

export const equipmentTypes = [
  'BARBELL',
  'DUMBBELL',
  'MACHINE',
  'CABLE',
  'BODYWEIGHT',
  'RESISTANCE_BAND',
  'KETTLEBELL',
  'NONE',
] as const;
export type EquipmentType = (typeof equipmentTypes)[number];

export const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
export type MealType = (typeof mealTypes)[number];

export const scheduleStatuses = ['PLANNED', 'COMPLETED', 'SKIPPED'] as const;
export type ScheduleStatus = (typeof scheduleStatuses)[number];

export const difficultyLevels = ['VERY_EASY', 'EASY', 'MODERATE', 'HARD', 'MAX_EFFORT'] as const;
export type DifficultyLevel = (typeof difficultyLevels)[number];

export const themeSchemes = ['light', 'dark'] as const;
export type ThemeScheme = (typeof themeSchemes)[number];

export const themePreferences = ['system', ...themeSchemes] as const;
export type ThemePreference = (typeof themePreferences)[number];

// Backward-compatible alias for existing imports.
export const themes = themePreferences;
