import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { workoutsController } from '../controllers/workouts.controller';
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutQuerySchema,
} from '../validators/workouts.validator';

export const workoutsRouter = Router();

workoutsRouter.get('/', validateRequest({ query: workoutQuerySchema }), workoutsController.list);
workoutsRouter.get('/:id', validateRequest({ params: idParamSchema }), workoutsController.getById);
workoutsRouter.post('/', validateRequest({ body: createWorkoutSchema }), workoutsController.create);
workoutsRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateWorkoutSchema }),
  workoutsController.update,
);
workoutsRouter.delete('/:id', validateRequest({ params: idParamSchema }), workoutsController.remove);
