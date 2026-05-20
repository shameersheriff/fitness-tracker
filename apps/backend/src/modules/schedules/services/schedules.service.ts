import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type {
  CreateScheduledWorkoutDto,
  ScheduleQueryDto,
  UpdateScheduledWorkoutDto,
} from '../dto/schedule.dto';
import { SchedulesRepository } from '../repositories/schedules.repository';

export class SchedulesService {
  constructor(private readonly repository = new SchedulesRepository()) {}

  async list(query: ScheduleQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      from: query.from,
      to: query.to,
      status: query.status,
    };
    const [data, total] = await Promise.all([
      this.repository.findMany(filters, skip, limit),
      this.repository.count(filters),
    ]);

    return { data, meta: getPaginationMeta(page, limit, total) };
  }

  async getById(id: string, userId?: string) {
    const schedule = await this.repository.findById(id, userId);
    if (!schedule) {
      throw new AppError('Scheduled workout not found', httpStatus.NOT_FOUND);
    }
    return schedule;
  }

  async getByDay(userId?: string) {
    return this.repository.findByDay(new Date(), userId);
  }

  async create(data: CreateScheduledWorkoutDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateScheduledWorkoutDto, userId?: string) {
    await this.getById(id, userId);
    return this.repository.update(id, data);
  }

  async complete(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.complete(id);
  }

  async remove(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.softDelete(id);
  }
}
