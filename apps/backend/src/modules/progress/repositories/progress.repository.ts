import type { Prisma } from '@prisma/client';

import { prisma } from '@/common/database/prisma';

import type { CreateBodyProgressDto } from '../dto/progress.dto';
import type { ProgressFilters } from '../types/progress.types';

export class ProgressRepository {
  private buildWhere(filters: ProgressFilters): Prisma.BodyProgressEntryWhereInput {
    return {
      deletedAt: null,
      userId: filters.userId,
      entryDate:
        filters.from || filters.to
          ? {
              gte: filters.from,
              lte: filters.to,
            }
          : undefined,
    };
  }

  async create(data: CreateBodyProgressDto, userId?: string) {
    return prisma.bodyProgressEntry.create({
      data: {
        ...data,
        entryDate: data.entryDate ?? new Date(),
        userId,
      },
    });
  }

  async history(filters: ProgressFilters, skip: number, take: number) {
    return prisma.bodyProgressEntry.findMany({
      where: this.buildWhere(filters),
      orderBy: { entryDate: 'desc' },
      skip,
      take,
    });
  }

  async count(filters: ProgressFilters) {
    return prisma.bodyProgressEntry.count({ where: this.buildWhere(filters) });
  }
}
