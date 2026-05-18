import type { MealType } from '@prisma/client';

export interface MealFilters {
  userId?: string;
  search?: string;
  mealType?: MealType;
  from?: Date;
  to?: Date;
  favorite?: boolean;
}
