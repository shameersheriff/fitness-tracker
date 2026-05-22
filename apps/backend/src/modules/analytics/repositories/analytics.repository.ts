import { prisma } from '@/common/database/prisma';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
    const startKey = toDateKey(start);

    return prisma.mealEntry.findMany({
      where: { userId, deletedAt: null, mealDate: { gte: startKey } },
      include: {
        meal: true,
      },
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
