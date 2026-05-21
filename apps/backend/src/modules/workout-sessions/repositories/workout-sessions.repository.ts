import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type {
  AddSessionSetDto,
  CreateWorkoutSessionDto,
  UpdateWorkoutSessionDto,
} from '../dto/workout-session.dto';
import type { WorkoutSessionFilters } from '../types/workout-session.types';

export class WorkoutSessionsRepository {
  private buildWhere(filters: WorkoutSessionFilters): Prisma.WorkoutSessionWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      workoutId: filters.workoutId,
      sessionDate:
        filters.from || filters.to
          ? {
              gte: filters.from,
              lte: filters.to,
            }
          : undefined,
    };
  }

  async findMany(filters: WorkoutSessionFilters, skip: number, take: number) {
    return prisma.workoutSession.findMany({
      where: this.buildWhere(filters),
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
      orderBy: { sessionDate: 'desc' },
      skip,
      take,
    });
  }

  async count(filters: WorkoutSessionFilters) {
    return prisma.workoutSession.count({ where: this.buildWhere(filters) });
  }

  async findById(id: string, userId?: string) {
    return prisma.workoutSession.findFirst({
      where: { id, userId, deletedAt: null },
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
    });
  }

  async create(data: CreateWorkoutSessionDto, userId?: string) {
    const { sets, ...sessionData } = data;
    return prisma.workoutSession.create({
      data: {
        ...sessionData,
        userId,
        sets: {
          create: sets,
        },
      },
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
    });
  }

  async update(id: string, data: UpdateWorkoutSessionDto) {
    const { sets, ...sessionData } = data;
    return prisma.$transaction(async (tx) => {
      if (sets) {
        await tx.workoutSessionSet.deleteMany({ where: { sessionId: id } });
      }

      return tx.workoutSession.update({
        where: { id },
        data: {
          ...sessionData,
          ...(sets
            ? {
                sets: {
                  create: sets,
                },
              }
            : {}),
        },
        include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
      });
    });
  }

  async complete(id: string) {
    return prisma.workoutSession.update({
      where: { id },
      data: { completedAt: new Date() },
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
    });
  }

  async addSet(sessionId: string, data: AddSessionSetDto) {
    const lastSet = await prisma.workoutSessionSet.findFirst({
      where: { sessionId },
      orderBy: { setNumber: 'desc' },
      select: { setNumber: true },
    });
    const nextSetNumber = (lastSet?.setNumber ?? 0) + 1;
    const set = await prisma.workoutSessionSet.create({
      data: { ...data, sessionId, setNumber: nextSetNumber },
    });
    return prisma.workoutSession.findFirst({
      where: { id: sessionId },
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
    });
  }

  async deleteSet(sessionId: string, setId: string) {
    await prisma.workoutSessionSet.deleteMany({
      where: { id: setId, sessionId },
    });
    return prisma.workoutSession.findFirst({
      where: { id: sessionId },
      include: { workout: true, sets: { orderBy: { setNumber: 'asc' } } },
    });
  }

  async softDelete(id: string) {
    return prisma.workoutSession.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
