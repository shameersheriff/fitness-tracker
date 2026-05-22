import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository()) {}

  async today(userId?: string) {
    const { workouts, mealEntries, nutritionGoal, latestProgress } =
      await this.repository.getTodayData(userId);

    const macros = mealEntries.reduce(
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

    const completedWorkouts = workouts.filter((workout) => workout.status === 'COMPLETED').length;

    return {
      date: new Date().toISOString(),
      workouts,
      completedWorkouts,
      remainingWorkouts: workouts.length - completedWorkouts,
      meals: mealEntries,
      macros,
      nutritionGoal,
      latestProgress,
      workoutStreak: completedWorkouts > 0 ? 1 : 0,
    };
  }

  async weeklySummary(userId?: string) {
    const { end, mealEntries, sessions, start, workouts } =
      await this.repository.getWeeklyData(userId);
    const completedWorkouts = workouts.filter((workout) => workout.status === 'COMPLETED').length;
    const caloriesConsumed = mealEntries.reduce((sum, entry) => {
      if (!entry.meal || entry.meal.deletedAt) {
        return sum;
      }
      return sum + entry.meal.calories * entry.quantity;
    }, 0);
    const proteinConsumed = mealEntries.reduce((sum, entry) => {
      if (!entry.meal || entry.meal.deletedAt) {
        return sum;
      }
      return sum + entry.meal.protein * entry.quantity;
    }, 0);
    const workoutVolume = sessions.reduce((sum, session) => {
      return (
        sum + session.sets.reduce((setSum, set) => setSum + (set.reps ?? 0) * (set.weight ?? 0), 0)
      );
    }, 0);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      scheduledWorkouts: workouts.length,
      completedWorkouts,
      completionRate: workouts.length ? (completedWorkouts / workouts.length) * 100 : 0,
      caloriesConsumed,
      proteinConsumed,
      workoutVolume,
    };
  }
}
