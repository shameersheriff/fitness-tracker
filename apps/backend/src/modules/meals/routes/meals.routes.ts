import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';
import { idParamSchema } from '@/common/validators/pagination.validator';

import { mealsController } from '../controllers/meals.controller';
import { createMealSchema, mealQuerySchema, updateMealSchema } from '../validators/meals.validator';

export const mealsRouter = Router();

mealsRouter.get('/', validateRequest({ query: mealQuerySchema }), mealsController.list);
mealsRouter.get('/:id', validateRequest({ params: idParamSchema }), mealsController.getById);
mealsRouter.post('/', validateRequest({ body: createMealSchema }), mealsController.create);
mealsRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateMealSchema }),
  mealsController.update,
);
mealsRouter.delete('/:id', validateRequest({ params: idParamSchema }), mealsController.remove);
