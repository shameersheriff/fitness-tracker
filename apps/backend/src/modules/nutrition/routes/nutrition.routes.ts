import { Router } from 'express';

import { prisma } from '@/common/database/prisma';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { ok } from '@/common/utils/apiResponse';

export const nutritionRouter = Router();

nutritionRouter.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const userId = req.userContext.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        deletedAt: null,
        mealDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
        fiber: acc.fiber + (meal.fiber ?? 0),
        sugar: acc.sugar + (meal.sugar ?? 0),
        sodium: acc.sodium + (meal.sodium ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 },
    );

    return ok(res, 'Nutrition summary fetched successfully', totals);
  }),
);
