import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type { CreateScheduledWorkoutDto, UpdateScheduledWorkoutDto } from '../dto/schedule.dto';
import type { ScheduleFilters } from '../types/schedule.types';

export class SchedulesRepository {
  private buildWhere(filters: ScheduleFilters): Prisma.ScheduledWorkoutWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      status: filters.status,
      scheduledDate:
        filters.from || filters.to
          ? {
              gte: filters.from,
              lte: filters.to,
            }
          : undefined,
    };
  }

  async findMany(filters: ScheduleFilters, skip: number, take: number) {
    return prisma.scheduledWorkout.findMany({
      where: this.buildWhere(filters),
      include: { workout: { include: { workoutType: true } } },
      orderBy: [{ scheduledDate: 'asc' }, { position: 'asc' }],
      skip,
      take,
    });
  }

  async count(filters: ScheduleFilters) {
    return prisma.scheduledWorkout.count({ where: this.buildWhere(filters) });
  }

  async findById(id: string, userId?: string) {
    return prisma.scheduledWorkout.findFirst({
      where: { id, userId, deletedAt: null },
      include: { workout: { include: { workoutType: true } } },
    });
  }

  async findByDay(date: Date, userId?: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return prisma.scheduledWorkout.findMany({
      where: {
        userId,
        deletedAt: null,
        scheduledDate: {
          gte: start,
          lt: end,
        },
      },
      include: { workout: { include: { workoutType: true } } },
      orderBy: { position: 'asc' },
    });
  }

  async reorderDay(scheduleIds: string[], date: Date, userId?: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return prisma.$transaction(async (tx) => {
      for (const [index, id] of scheduleIds.entries()) {
        await tx.scheduledWorkout.updateMany({
          where: {
            id,
            userId,
            deletedAt: null,
            scheduledDate: {
              gte: start,
              lt: end,
            },
          },
          data: { position: index + 1 },
        });
      }

      return tx.scheduledWorkout.findMany({
        where: {
          userId,
          deletedAt: null,
          scheduledDate: {
            gte: start,
            lt: end,
          },
        },
        include: { workout: { include: { workoutType: true } } },
        orderBy: { position: 'asc' },
      });
    });
  }

  async create(data: CreateScheduledWorkoutDto, userId?: string) {
    return prisma.scheduledWorkout.create({
      data: { ...data, userId },
      include: { workout: { include: { workoutType: true } } },
    });
  }

  async update(id: string, data: UpdateScheduledWorkoutDto) {
    return prisma.scheduledWorkout.update({
      where: { id },
      data,
      include: { workout: { include: { workoutType: true } } },
    });
  }

  async complete(id: string) {
    return prisma.scheduledWorkout.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: { workout: { include: { workoutType: true } } },
    });
  }

  async softDelete(id: string) {
    return prisma.scheduledWorkout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
