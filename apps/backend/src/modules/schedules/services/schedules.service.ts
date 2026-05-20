import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type {
  CreateScheduledWorkoutDto,
  ReorderDaySchedulesDto,
  ReorderSchedulesByDateDto,
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

  async reorderDay(data: ReorderDaySchedulesDto, userId?: string) {
    const dailySchedules = await this.repository.findByDay(new Date(), userId);

    if (dailySchedules.length !== data.scheduleIds.length) {
      throw new AppError('Invalid daily workout order payload', httpStatus.BAD_REQUEST);
    }

    const dailyIds = new Set(dailySchedules.map((schedule: { id: string }) => schedule.id));
    const hasUnknownIds = data.scheduleIds.some((id: string) => !dailyIds.has(id));
    const hasDuplicates = new Set(data.scheduleIds).size !== data.scheduleIds.length;

    if (hasUnknownIds || hasDuplicates) {
      throw new AppError('Invalid daily workout order payload', httpStatus.BAD_REQUEST);
    }

    return this.repository.reorderDay(data.scheduleIds, new Date(), userId);
  }

  async reorderByDate(data: ReorderSchedulesByDateDto, userId?: string) {
    const daySchedules = await this.repository.findByDay(data.date, userId);

    if (daySchedules.length !== data.scheduleIds.length) {
      throw new AppError('Invalid workout order payload', httpStatus.BAD_REQUEST);
    }

    const dayIds = new Set(daySchedules.map((schedule: { id: string }) => schedule.id));
    const hasUnknownIds = data.scheduleIds.some((id: string) => !dayIds.has(id));
    const hasDuplicates = new Set(data.scheduleIds).size !== data.scheduleIds.length;

    if (hasUnknownIds || hasDuplicates) {
      throw new AppError('Invalid workout order payload', httpStatus.BAD_REQUEST);
    }

    return this.repository.reorderDay(data.scheduleIds, data.date, userId);
  }

  async create(data: CreateScheduledWorkoutDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateScheduledWorkoutDto, userId?: string) {
    await this.getById(id, userId);
    return this.repository.update(id, data);
  }

  async complete(id: string, userId?: string) {
    const schedule = await this.getById(id, userId);

    if (schedule.status === 'COMPLETED') {
      return schedule;
    }

    return this.repository.complete(id);
  }

  async remove(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.softDelete(id);
  }
}
