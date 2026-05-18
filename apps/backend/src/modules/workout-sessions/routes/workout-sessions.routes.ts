import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { workoutSessionsController } from '../controllers/workout-sessions.controller';
import {
  createWorkoutSessionSchema,
  updateWorkoutSessionSchema,
  workoutSessionQuerySchema,
} from '../validators/workout-sessions.validator';

export const workoutSessionsRouter = Router();

workoutSessionsRouter.get(
  '/',
  validateRequest({ query: workoutSessionQuerySchema }),
  workoutSessionsController.list,
);
workoutSessionsRouter.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  workoutSessionsController.getById,
);
workoutSessionsRouter.post(
  '/',
  validateRequest({ body: createWorkoutSessionSchema }),
  workoutSessionsController.create,
);
workoutSessionsRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateWorkoutSessionSchema }),
  workoutSessionsController.update,
);
workoutSessionsRouter.patch(
  '/:id/complete',
  validateRequest({ params: idParamSchema }),
  workoutSessionsController.complete,
);
workoutSessionsRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  workoutSessionsController.remove,
);
