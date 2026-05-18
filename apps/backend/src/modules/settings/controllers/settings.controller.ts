import { ok } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import { SettingsService } from '../services/settings.service';

const service = new SettingsService();

export const settingsController = {
  get: asyncHandler(async (req, res) => {
    const data = await service.get(req.userContext.userId);
    return ok(res, 'Settings fetched successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.body, req.userContext.userId);
    return ok(res, 'Settings updated successfully', data);
  }),
};
