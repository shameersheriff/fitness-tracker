import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type { CreateWorkoutDto, UpdateWorkoutDto } from '../dto/workout.dto';
import type { WorkoutFilters } from '../types/workout.types';

export class WorkoutsRepository {
  private buildWhere(filters: WorkoutFilters): Prisma.WorkoutWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      muscleGroup: filters.muscleGroup,
      equipmentType: filters.equipmentType,
      workoutTypeId: filters.workoutTypeId,
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { description: { contains: filters.search } },
              { instructions: { contains: filters.search } },
            ],
          }
        : {}),
    };
  }

  async findMany(filters: WorkoutFilters, skip: number, take: number) {
    return prisma.workout.findMany({
      where: this.buildWhere(filters),
      include: { workoutType: true },
      orderBy: { name: 'asc' },
      skip,
      take,
    });
  }

  async count(filters: WorkoutFilters) {
    return prisma.workout.count({ where: this.buildWhere(filters) });
  }

  async findById(id: string, userId?: string) {
    return prisma.workout.findFirst({
      where: { id, userId, deletedAt: null },
      include: { workoutType: true },
    });
  }

  async create(data: CreateWorkoutDto, userId?: string) {
    return prisma.workout.create({
      data: { ...data, userId },
      include: { workoutType: true },
    });
  }

  async update(id: string, data: UpdateWorkoutDto) {
    return prisma.workout.update({
      where: { id },
      data,
      include: { workoutType: true },
    });
  }

  async softDelete(id: string) {
    return prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
