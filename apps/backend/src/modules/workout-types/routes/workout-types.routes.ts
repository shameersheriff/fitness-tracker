import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { workoutTypesController } from '../controllers/workout-types.controller';
import {
  createWorkoutTypeSchema,
  updateWorkoutTypeSchema,
  workoutTypeQuerySchema,
} from '../validators/workout-types.validator';

export const workoutTypesRouter = Router();

workoutTypesRouter.get(
  '/',
  validateRequest({ query: workoutTypeQuerySchema }),
  workoutTypesController.list,
);
workoutTypesRouter.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  workoutTypesController.getById,
);
workoutTypesRouter.post(
  '/',
  validateRequest({ body: createWorkoutTypeSchema }),
  workoutTypesController.create,
);
workoutTypesRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateWorkoutTypeSchema }),
  workoutTypesController.update,
);
workoutTypesRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  workoutTypesController.remove,
);
