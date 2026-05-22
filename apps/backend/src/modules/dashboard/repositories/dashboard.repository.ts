import { prisma } from '@/common/database/prisma';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class DashboardRepository {
  async getTodayData(userId?: string, date = new Date()) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    const startKey = toDateKey(start);
    const endKey = toDateKey(end);

    const [workouts, mealEntries, nutritionGoal, latestProgress] = await Promise.all([
      prisma.scheduledWorkout.findMany({
        where: {
          userId,
          deletedAt: null,
          scheduledDate: { gte: start, lt: end },
        },
        include: { workout: { include: { workoutType: true } } },
        orderBy: { position: 'asc' },
      }),
      prisma.mealEntry.findMany({
        where: {
          userId,
          deletedAt: null,
          mealDate: { gte: startKey, lt: endKey },
        },
        include: {
          meal: true,
        },
        orderBy: { mealDate: 'asc' },
      }),
      prisma.nutritionGoal.findFirst({
        where: {
          userId,
          deletedAt: null,
          effectiveFrom: { lte: end },
        },
        orderBy: { effectiveFrom: 'desc' },
      }),
      prisma.bodyProgressEntry.findFirst({
        where: { userId, deletedAt: null },
        orderBy: { entryDate: 'desc' },
      }),
    ]);

    return { workouts, mealEntries, nutritionGoal, latestProgress };
  }

  async getWeeklyData(userId?: string, date = new Date()) {
    const start = new Date(date);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const startKey = toDateKey(start);
    const endKey = toDateKey(end);

    const [workouts, mealEntries, sessions] = await Promise.all([
      prisma.scheduledWorkout.findMany({
        where: {
          userId,
          deletedAt: null,
          scheduledDate: { gte: start, lt: end },
        },
      }),
      prisma.mealEntry.findMany({
        where: {
          userId,
          deletedAt: null,
          mealDate: { gte: startKey, lt: endKey },
        },
        include: {
          meal: true,
        },
      }),
      prisma.workoutSession.findMany({
        where: {
          userId,
          deletedAt: null,
          sessionDate: { gte: start, lt: end },
        },
        include: { sets: true },
      }),
    ]);

    return { start, end, workouts, mealEntries, sessions };
  }
}
