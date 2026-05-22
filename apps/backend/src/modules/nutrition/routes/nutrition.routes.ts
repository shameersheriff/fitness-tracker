import { Router } from 'express';

import { prisma } from '@/common/database/prisma';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { ok } from '@/common/utils/apiResponse';

export const nutritionRouter = Router();

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

nutritionRouter.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const userId = req.userContext.userId;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayKey = toDateKey(today);
    const tomorrowKey = toDateKey(tomorrow);

    const entries = await prisma.mealEntry.findMany({
      where: {
        userId,
        deletedAt: null,
        mealDate: {
          gte: todayKey,
          lt: tomorrowKey,
        },
      },
      include: {
        meal: true,
      },
    });

    const totals = entries.reduce(
      (acc, entry) => {
        const meal = entry.meal;
        if (!meal || meal.deletedAt) {
          return acc;
        }

        const quantity = entry.quantity;
        return {
          calories: acc.calories + meal.calories * quantity,
          protein: acc.protein + meal.protein * quantity,
          carbs: acc.carbs + meal.carbs * quantity,
          fats: acc.fats + meal.fats * quantity,
          fiber: acc.fiber + (meal.fiber ?? 0) * quantity,
          sugar: acc.sugar + (meal.sugar ?? 0) * quantity,
          sodium: acc.sodium + (meal.sodium ?? 0) * quantity,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 },
    );

    return ok(res, 'Nutrition summary fetched successfully', totals);
  }),
);
