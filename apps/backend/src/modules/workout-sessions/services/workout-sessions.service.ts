import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type {
  CreateWorkoutSessionDto,
  UpdateWorkoutSessionDto,
  WorkoutSessionQueryDto,
} from '../dto/workout-session.dto';
import { WorkoutSessionsRepository } from '../repositories/workout-sessions.repository';

export class WorkoutSessionsService {
  constructor(private readonly repository = new WorkoutSessionsRepository()) {}

  async list(query: WorkoutSessionQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      workoutId: query.workoutId,
      from: query.from,
      to: query.to,
    };
    const [data, total] = await Promise.all([
      this.repository.findMany(filters, skip, limit),
      this.repository.count(filters),
    ]);
    return { data, meta: getPaginationMeta(page, limit, total) };
  }

  async getById(id: string, userId?: string) {
    const session = await this.repository.findById(id, userId);
    if (!session) {
      throw new AppError('Workout session not found', httpStatus.NOT_FOUND);
    }
    return session;
  }

  async create(data: CreateWorkoutSessionDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateWorkoutSessionDto, userId?: string) {
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
