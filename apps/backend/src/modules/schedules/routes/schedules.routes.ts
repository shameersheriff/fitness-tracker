import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { schedulesController } from '../controllers/schedules.controller';
import {
  createScheduledWorkoutSchema,
  scheduleQuerySchema,
  updateScheduledWorkoutSchema,
} from '../validators/schedules.validator';

export const schedulesRouter = Router();

schedulesRouter.get('/', validateRequest({ query: scheduleQuerySchema }), schedulesController.list);
schedulesRouter.get('/day', schedulesController.getByDay);
schedulesRouter.post(
  '/',
  validateRequest({ body: createScheduledWorkoutSchema }),
  schedulesController.create,
);
schedulesRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateScheduledWorkoutSchema }),
  schedulesController.update,
);
schedulesRouter.patch(
  '/:id/complete',
  validateRequest({ params: idParamSchema }),
  schedulesController.complete,
);
schedulesRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  schedulesController.remove,
);
