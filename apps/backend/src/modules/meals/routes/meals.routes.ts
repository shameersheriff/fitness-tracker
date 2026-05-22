import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { mealsController } from '../controllers/meals.controller';
import {
  createMealEntrySchema,
  createMealSchema,
  mealDayQuerySchema,
  mealQuerySchema,
  updateMealSchema,
} from '../validators/meals.validator';

export const mealsRouter = Router();

mealsRouter.get('/', validateRequest({ query: mealQuerySchema }), mealsController.list);
mealsRouter.post('/', validateRequest({ body: createMealSchema }), mealsController.create);
mealsRouter.get('/day', validateRequest({ query: mealDayQuerySchema }), mealsController.dayLog);
mealsRouter.post(
  '/entries',
  validateRequest({ body: createMealEntrySchema }),
  mealsController.createEntry,
);
mealsRouter.get('/:id', validateRequest({ params: idParamSchema }), mealsController.getById);
mealsRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateMealSchema }),
  mealsController.update,
);
mealsRouter.delete('/:id', validateRequest({ params: idParamSchema }), mealsController.remove);
