import { created, noContent, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { WorkoutQueryDto } from '../dto/workout.dto';
import { WorkoutsService } from '../services/workouts.service';

const service = new WorkoutsService();

export const workoutsController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.query as unknown as WorkoutQueryDto, req.userContext.userId);
    return paginated(res, 'Workouts fetched successfully', result.data, result.meta);
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id, req.userContext.userId);
    return ok(res, 'Workout fetched successfully', data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Workout created successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Workout updated successfully', data);
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
};
