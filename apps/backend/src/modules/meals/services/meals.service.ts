import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type {
  CreateMealDto,
  CreateMealEntryDto,
  MealDayQueryDto,
  MealQueryDto,
  UpdateMealDto,
} from '../dto/meal.dto';
import { MealsRepository } from '../repositories/meals.repository';
import type { MealLogTotals } from '../types/meal.types';

export class MealsService {
  constructor(private readonly repository = new MealsRepository()) {}

  private getDateRange(dateKey?: string) {
    const from = dateKey ?? new Date().toISOString().slice(0, 10);
    const base = new Date(`${from}T00:00:00.000Z`);
    const next = new Date(base);
    next.setUTCDate(base.getUTCDate() + 1);
    const to = next.toISOString().slice(0, 10);
    return { from, to };
  }

  async list(query: MealQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      search: query.search,
      mealType: query.mealType,
      from: query.from,
      to: query.to,
      favorite: query.favorite,
    };
    const [data, total] = await Promise.all([
      this.repository.findMany(filters, skip, limit),
      this.repository.count(filters),
    ]);
    return { data, meta: getPaginationMeta(page, limit, total) };
  }

  async getById(id: string, userId?: string) {
    const meal = await this.repository.findById(id, userId);
    if (!meal) {
      throw new AppError('Meal not found', httpStatus.NOT_FOUND);
    }
    return meal;
  }

  async create(data: CreateMealDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateMealDto, userId?: string) {
    await this.getById(id, userId);
    return this.repository.update(id, data);
  }

  async remove(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.softDelete(id);
  }

  async dayLog(query: MealDayQueryDto, userId?: string) {
    const { from, to } = this.getDateRange(query.date);
    const entries = await this.repository.findEntries({
      userId,
      from,
      to,
    });

    const totals = entries.reduce<MealLogTotals>(
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

    return {
      date: from,
      entries,
      totals,
    };
  }

  async createEntry(data: CreateMealEntryDto, userId?: string) {
    await this.getById(data.mealId, userId);
    return this.repository.createEntry(data, userId);
  }

  async removeEntry(id: string, userId?: string) {
    const entry = await this.repository.findEntryById(id, userId);
    if (!entry) {
      throw new AppError('Meal log entry not found', httpStatus.NOT_FOUND);
    }

    return this.repository.softDeleteEntry(id);
  }
}
