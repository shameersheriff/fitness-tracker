import { created, noContent, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { ScheduleQueryDto } from '../dto/schedule.dto';
import { SchedulesService } from '../services/schedules.service';

const service = new SchedulesService();

function parseDayQueryDate(value: unknown) {
  if (typeof value !== 'string') {
    return new Date();
  }

  const parts = value.split('-');
  if (parts.length !== 3) {
    return new Date();
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return new Date(year, month - 1, day);
}

export const schedulesController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(
      req.query as unknown as ScheduleQueryDto,
      req.userContext.userId,
    );
    return paginated(res, 'Scheduled workouts fetched successfully', result.data, result.meta);
  }),
  getByDay: asyncHandler(async (req, res) => {
    const data = await service.getByDay(parseDayQueryDate(req.query.date), req.userContext.userId);
    return ok(res, 'Daily schedule fetched successfully', data);
  }),
  reorderDay: asyncHandler(async (req, res) => {
    const data = await service.reorderDay(req.body, req.userContext.userId);
    return ok(res, 'Daily workout order updated successfully', data);
  }),
  reorderByDate: asyncHandler(async (req, res) => {
    const data = await service.reorderByDate(req.body, req.userContext.userId);
    return ok(res, 'Workout order updated successfully', data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Scheduled workout created successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Scheduled workout updated successfully', data);
  }),
  complete: asyncHandler(async (req, res) => {
    const data = await service.complete(req.params.id, req.userContext.userId);
    return ok(res, 'Scheduled workout completed successfully', data);
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
};
