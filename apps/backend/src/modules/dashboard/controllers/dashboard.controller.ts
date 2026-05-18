import { ok } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import { DashboardService } from '../services/dashboard.service';

const service = new DashboardService();

export const dashboardController = {
  today: asyncHandler(async (req, res) => {
    const data = await service.today(req.userContext.userId);
    return ok(res, 'Dashboard fetched successfully', data);
  }),
  weeklySummary: asyncHandler(async (req, res) => {
    const data = await service.weeklySummary(req.userContext.userId);
    return ok(res, 'Weekly summary fetched successfully', data);
  }),
};
