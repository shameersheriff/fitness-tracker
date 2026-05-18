import { created, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { GoalsQueryDto } from '../dto/goal.dto';
import { GoalsService } from '../services/goals.service';

const service = new GoalsService();

export const goalsController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.query as unknown as GoalsQueryDto, req.userContext.userId);
    return paginated(res, 'Goals fetched successfully', result.data, result.meta);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Goal created successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Goal updated successfully', data);
  }),
};
