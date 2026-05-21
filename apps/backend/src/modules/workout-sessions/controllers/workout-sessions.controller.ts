import { created, noContent, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { WorkoutSessionQueryDto } from '../dto/workout-session.dto';
import { WorkoutSessionsService } from '../services/workout-sessions.service';

const service = new WorkoutSessionsService();

export const workoutSessionsController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(
      req.query as unknown as WorkoutSessionQueryDto,
      req.userContext.userId,
    );
    return paginated(res, 'Workout sessions fetched successfully', result.data, result.meta);
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id, req.userContext.userId);
    return ok(res, 'Workout session fetched successfully', data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Workout session created successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Workout session updated successfully', data);
  }),
  complete: asyncHandler(async (req, res) => {
    const data = await service.complete(req.params.id, req.userContext.userId);
    return ok(res, 'Workout session completed successfully', data);
  }),
  addSet: asyncHandler(async (req, res) => {
    const data = await service.addSet(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Set added successfully', data);
  }),
  deleteSet: asyncHandler(async (req, res) => {
    const data = await service.deleteSet(req.params.id, req.params.setId, req.userContext.userId);
    return ok(res, 'Set deleted successfully', data);
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
};
