import { format } from 'date-fns';

import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  constructor(private readonly repository = new AnalyticsRepository()) {}

  async workouts(userId?: string) {
    const workouts = await this.repository.workouts(userId);
    const totals = workouts.reduce<Record<string, number>>((acc, workout) => {
      acc[workout.muscleGroup] = (acc[workout.muscleGroup] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(totals).map(([label, value]) => ({ label, value }));
  }

  async nutrition(userId?: string) {
    const meals = await this.repository.nutrition(userId);
    const totals = meals.reduce<Record<string, number>>((acc, meal) => {
      const label = format(meal.mealDate, 'EEE');
      acc[label] = (acc[label] ?? 0) + meal.calories;
      return acc;
    }, {});

    return Object.entries(totals).map(([label, value]) => ({ label, value }));
  }

  async progress(userId?: string) {
    const entries = await this.repository.progress(userId);
    return entries.map((entry) => ({
      label: format(entry.entryDate, 'MMM d'),
      value: entry.bodyWeight ?? 0,
    }));
  }
}
