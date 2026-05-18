import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';

import { progressController } from '../controllers/progress.controller';
import {
  createBodyProgressSchema,
  progressHistoryQuerySchema,
} from '../validators/progress.validator';

export const progressRouter = Router();

progressRouter.post(
  '/body',
  validateRequest({ body: createBodyProgressSchema }),
  progressController.createBodyEntry,
);
progressRouter.get(
  '/body/history',
  validateRequest({ query: progressHistoryQuerySchema }),
  progressController.history,
);
