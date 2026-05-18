import { httpStatus } from '@/common/constants/httpStatus';
import { AppError } from '@/common/errors/AppError';
import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type { CreateWorkoutDto, UpdateWorkoutDto, WorkoutQueryDto } from '../dto/workout.dto';
import { WorkoutsRepository } from '../repositories/workouts.repository';

export class WorkoutsService {
  constructor(private readonly repository = new WorkoutsRepository()) {}

  async list(query: WorkoutQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      search: query.search,
      muscleGroup: query.muscleGroup,
      equipmentType: query.equipmentType,
      workoutTypeId: query.workoutTypeId,
    };
    const [data, total] = await Promise.all([
      this.repository.findMany(filters, skip, limit),
      this.repository.count(filters),
    ]);

    return { data, meta: getPaginationMeta(page, limit, total) };
  }

  async getById(id: string, userId?: string) {
    const workout = await this.repository.findById(id, userId);
    if (!workout) {
      throw new AppError('Workout not found', httpStatus.NOT_FOUND);
    }
    return workout;
  }

  async create(data: CreateWorkoutDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateWorkoutDto, userId?: string) {
    await this.getById(id, userId);
    return this.repository.update(id, data);
  }

  async remove(id: string, userId?: string) {
    await this.getById(id, userId);
    return this.repository.softDelete(id);
  }
}
