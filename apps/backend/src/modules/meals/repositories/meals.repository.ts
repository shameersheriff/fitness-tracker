import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type { CreateMealDto, CreateMealEntryDto, UpdateMealDto } from '../dto/meal.dto';
import type { MealEntryFilters, MealFilters } from '../types/meal.types';

export class MealsRepository {
  private buildWhere(filters: MealFilters): Prisma.MealWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      mealType: filters.mealType,
      favorite: filters.favorite,
      mealDate:
        filters.from || filters.to
          ? {
              gte: filters.from,
              lte: filters.to,
            }
          : undefined,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search } },
              { description: { contains: filters.search } },
            ],
          }
        : {}),
    };
  }

  async findMany(filters: MealFilters, skip: number, take: number) {
    return prisma.meal.findMany({
      where: this.buildWhere(filters),
      orderBy: [{ mealDate: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    });
  }

  async count(filters: MealFilters) {
    return prisma.meal.count({ where: this.buildWhere(filters) });
  }

  async findById(id: string, userId?: string) {
    return prisma.meal.findFirst({ where: { id, userId, deletedAt: null } });
  }

  async create(data: CreateMealDto, userId?: string) {
    return prisma.meal.create({ data: { ...data, userId } });
  }

  async update(id: string, data: UpdateMealDto) {
    return prisma.meal.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.meal.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findEntries(filters: MealEntryFilters) {
    return prisma.mealEntry.findMany({
      where: {
        deletedAt: null,
        userId: filters.userId,
        mealDate: {
          gte: filters.from,
          lt: filters.to,
        },
      },
      include: {
        meal: true,
      },
      orderBy: [{ mealDate: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async createEntry(data: CreateMealEntryDto, userId?: string) {
    const todayKey = new Date().toISOString().slice(0, 10);
    return prisma.mealEntry.create({
      data: {
        mealId: data.mealId,
        mealDate: data.mealDate ?? todayKey,
        quantity: data.quantity,
        notes: data.notes,
        userId,
      },
      include: {
        meal: true,
      },
    });
  }
}
