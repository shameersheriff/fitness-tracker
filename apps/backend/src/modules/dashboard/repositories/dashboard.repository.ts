import { prisma } from '@/common/database/prisma';

export class DashboardRepository {
  async getTodayData(userId?: string, date = new Date()) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const [workouts, meals, nutritionGoal, latestProgress] = await Promise.all([
      prisma.scheduledWorkout.findMany({
        where: {
          userId,
          deletedAt: null,
          scheduledDate: { gte: start, lt: end },
        },
        include: { workout: { include: { workoutType: true } } },
        orderBy: { position: 'asc' },
      }),
      prisma.meal.findMany({
        where: {
          userId,
          deletedAt: null,
          mealDate: { gte: start, lt: end },
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

    return { workouts, meals, nutritionGoal, latestProgress };
  }

  async getWeeklyData(userId?: string, date = new Date()) {
    const start = new Date(date);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const [workouts, meals, sessions] = await Promise.all([
      prisma.scheduledWorkout.findMany({
        where: {
          userId,
          deletedAt: null,
          scheduledDate: { gte: start, lt: end },
        },
      }),
      prisma.meal.findMany({
        where: {
          userId,
          deletedAt: null,
          mealDate: { gte: start, lt: end },
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

    return { start, end, workouts, meals, sessions };
  }
}
