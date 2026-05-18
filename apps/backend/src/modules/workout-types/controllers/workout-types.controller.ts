import { created, noContent, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { WorkoutTypeQueryDto } from '../dto/workout-type.dto';
import { WorkoutTypesService } from '../services/workout-types.service';

const service = new WorkoutTypesService();

export const workoutTypesController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.query as unknown as WorkoutTypeQueryDto, req.userContext.userId);
    return paginated(res, 'Workout types fetched successfully', result.data, result.meta);
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id, req.userContext.userId);
    return ok(res, 'Workout type fetched successfully', data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Workout type created successfully', data);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Workout type updated successfully', data);
  }),

  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
};
