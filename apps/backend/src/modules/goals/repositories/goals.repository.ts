import { prisma } from '@/common/database/prisma';

import type { CreateNutritionGoalDto, UpdateNutritionGoalDto } from '../dto/goal.dto';
import type { GoalFilters } from '../types/goal.types';

export class GoalsRepository {
  async findMany(filters: GoalFilters, skip: number, take: number) {
    return prisma.nutritionGoal.findMany({
      where: { userId: filters.userId, deletedAt: null },
      orderBy: { effectiveFrom: 'desc' },
      skip,
      take,
    });
  }

  async count(filters: GoalFilters) {
    return prisma.nutritionGoal.count({ where: { userId: filters.userId, deletedAt: null } });
  }

  async findById(id: string, userId?: string) {
    return prisma.nutritionGoal.findFirst({ where: { id, userId, deletedAt: null } });
  }

  async create(data: CreateNutritionGoalDto, userId?: string) {
    return prisma.nutritionGoal.create({ data: { ...data, userId } });
  }

  async update(id: string, data: UpdateNutritionGoalDto) {
    return prisma.nutritionGoal.update({ where: { id }, data });
  }
}
