import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository()) {}

  async today(userId?: string) {
    const { workouts, meals, nutritionGoal, latestProgress } =
      await this.repository.getTodayData(userId);

    const macros = meals.reduce(
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

    const completedWorkouts = workouts.filter((workout) => workout.status === 'COMPLETED').length;

    return {
      date: new Date().toISOString(),
      workouts,
      completedWorkouts,
      remainingWorkouts: workouts.length - completedWorkouts,
      meals,
      macros,
      nutritionGoal,
      latestProgress,
      workoutStreak: completedWorkouts > 0 ? 1 : 0,
    };
  }

  async weeklySummary(userId?: string) {
    const { end, meals, sessions, start, workouts } = await this.repository.getWeeklyData(userId);
    const completedWorkouts = workouts.filter((workout) => workout.status === 'COMPLETED').length;
    const caloriesConsumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const proteinConsumed = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const workoutVolume = sessions.reduce((sum, session) => {
      return (
        sum +
        session.sets.reduce((setSum, set) => setSum + (set.reps ?? 0) * (set.weight ?? 0), 0)
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
