import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { goalsController } from '../controllers/goals.controller';
import {
  createNutritionGoalSchema,
  goalsQuerySchema,
  updateNutritionGoalSchema,
} from '../validators/goals.validator';

export const goalsRouter = Router();

goalsRouter.get('/', validateRequest({ query: goalsQuerySchema }), goalsController.list);
goalsRouter.post('/', validateRequest({ body: createNutritionGoalSchema }), goalsController.create);
goalsRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateNutritionGoalSchema }),
  goalsController.update,
);
