import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type {
  CreateWorkoutTypeDto,
  UpdateWorkoutTypeDto,
  WorkoutTypeQueryDto,
} from '../dto/workout-type.dto';
import { WorkoutTypesRepository } from '../repositories/workout-types.repository';

export class WorkoutTypesService {
  constructor(private readonly repository = new WorkoutTypesRepository()) {}

  async list(query: WorkoutTypeQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      search: query.search,
      trackingType: query.trackingType,
    };
    const [data, total] = await Promise.all([
      this.repository.findMany(filters, skip, limit),
      this.repository.count(filters),
    ]);

    return {
      data,
      meta: getPaginationMeta(page, limit, total),
    };
  }

  async getById(id: string, userId?: string) {
    const workoutType = await this.repository.findById(id, userId);
    if (!workoutType) {
      throw new AppError('Workout type not found', httpStatus.NOT_FOUND);
    }
    return workoutType;
  }

  async create(data: CreateWorkoutTypeDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateWorkoutTypeDto, userId?: string) {
    await this.getById(id, userId);
    return this.repository.update(id, data, userId);
  }

  async remove(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.softDelete(id);
  }
}
