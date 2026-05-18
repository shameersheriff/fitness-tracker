import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type { CreateMealDto, MealQueryDto, UpdateMealDto } from '../dto/meal.dto';
import { MealsRepository } from '../repositories/meals.repository';

export class MealsService {
  constructor(private readonly repository = new MealsRepository()) {}

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
}
