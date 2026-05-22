import type { MealType } from '@prisma/client';

export interface MealEntity {
  id: string;
  userId?: string | null;
  title: string;
  mealType: MealType;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  mealDate: string;
}
