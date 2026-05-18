import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type { CreateNutritionGoalDto, GoalsQueryDto, UpdateNutritionGoalDto } from '../dto/goal.dto';
import { GoalsRepository } from '../repositories/goals.repository';

export class GoalsService {
  constructor(private readonly repository = new GoalsRepository()) {}

  async list(query: GoalsQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const [data, total] = await Promise.all([
      this.repository.findMany({ userId }, skip, limit),
      this.repository.count({ userId }),
    ]);
    return { data, meta: getPaginationMeta(page, limit, total) };
  }

  async create(data: CreateNutritionGoalDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateNutritionGoalDto, userId?: string) {
    const goal = await this.repository.findById(id, userId);
    if (!goal) {
      throw new AppError('Nutrition goal not found', httpStatus.NOT_FOUND);
    }
    return this.repository.update(id, data);
  }
}
