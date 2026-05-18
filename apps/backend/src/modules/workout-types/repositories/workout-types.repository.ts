import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type { CreateWorkoutTypeDto, UpdateWorkoutTypeDto } from '../dto/workout-type.dto';
import type { WorkoutTypeFilters } from '../types/workout-type.types';

export class WorkoutTypesRepository {
  private buildWhere(filters: WorkoutTypeFilters): Prisma.WorkoutTypeWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      trackingType: filters.trackingType,
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { description: { contains: filters.search } },
            ],
          }
        : {}),
    };
  }

  async findMany(filters: WorkoutTypeFilters, skip: number, take: number) {
    return prisma.workoutType.findMany({
      where: this.buildWhere(filters),
      orderBy: { name: 'asc' },
      skip,
      take,
    });
  }

  async count(filters: WorkoutTypeFilters) {
    return prisma.workoutType.count({
      where: this.buildWhere(filters),
    });
  }

  async findById(id: string, userId?: string) {
    return prisma.workoutType.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateWorkoutTypeDto, userId?: string) {
    return prisma.workoutType.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateWorkoutTypeDto, userId?: string) {
    return prisma.workoutType.update({
      where: { id },
      data: {
        ...data,
        userId,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.workoutType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
