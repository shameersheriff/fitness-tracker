import { prisma } from '@/common/database/prisma';

export class AnalyticsRepository {
  async workouts(userId?: string) {
    return prisma.workout.findMany({
      where: { userId, deletedAt: null },
      select: { muscleGroup: true },
    });
  }

  async nutrition(userId?: string) {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return prisma.meal.findMany({
      where: { userId, deletedAt: null, mealDate: { gte: start } },
      orderBy: { mealDate: 'asc' },
    });
  }

  async progress(userId?: string) {
    return prisma.bodyProgressEntry.findMany({
      where: { userId, deletedAt: null },
      orderBy: { entryDate: 'asc' },
      take: 30,
    });
  }
}
