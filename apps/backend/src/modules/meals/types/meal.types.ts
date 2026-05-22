import type { MealType } from '@prisma/client';

export interface MealFilters {
  userId?: string;
  search?: string;
  mealType?: MealType;
  from?: Date;
  to?: Date;
  favorite?: boolean;
}

export interface MealEntryFilters {
  userId?: string;
  from: string;
  to: string;
}

export interface MealLogTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
}
