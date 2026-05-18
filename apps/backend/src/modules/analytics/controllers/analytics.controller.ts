import { ok } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import { AnalyticsService } from '../services/analytics.service';

const service = new AnalyticsService();

export const analyticsController = {
  workouts: asyncHandler(async (req, res) => {
    const data = await service.workouts(req.userContext.userId);
    return ok(res, 'Workout analytics fetched successfully', data);
  }),
  nutrition: asyncHandler(async (req, res) => {
    const data = await service.nutrition(req.userContext.userId);
    return ok(res, 'Nutrition analytics fetched successfully', data);
  }),
  progress: asyncHandler(async (req, res) => {
    const data = await service.progress(req.userContext.userId);
    return ok(res, 'Progress analytics fetched successfully', data);
  }),
};
