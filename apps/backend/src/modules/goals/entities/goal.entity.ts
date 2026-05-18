export interface NutritionGoalEntity {
  id: string;
  userId?: string | null;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterMl: number;
  effectiveFrom: Date;
}
