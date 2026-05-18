import { created, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { ProgressHistoryQueryDto } from '../dto/progress.dto';
import { ProgressService } from '../services/progress.service';

const service = new ProgressService();

export const progressController = {
  createBodyEntry: asyncHandler(async (req, res) => {
    const data = await service.createBodyEntry(req.body, req.userContext.userId);
    return created(res, 'Body progress entry created successfully', data);
  }),
  history: asyncHandler(async (req, res) => {
    const result = await service.history(req.query as unknown as ProgressHistoryQueryDto, req.userContext.userId);
    return paginated(res, 'Body progress history fetched successfully', result.data, result.meta);
  }),
};
