import { Router } from 'express';
import { z } from 'zod';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { workoutSessionsController } from '../controllers/workout-sessions.controller';
import {
  addSessionSetSchema,
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
workoutSessionsRouter.post(
  '/:id/sets',
  validateRequest({ params: idParamSchema, body: addSessionSetSchema }),
  workoutSessionsController.addSet,
);
workoutSessionsRouter.delete(
  '/:id/sets/:setId',
  validateRequest({ params: idParamSchema.extend({ setId: z.string().min(1) }) }),
  workoutSessionsController.deleteSet,
);
workoutSessionsRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  workoutSessionsController.remove,
);
