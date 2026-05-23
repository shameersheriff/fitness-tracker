import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';

import { settingsController } from '../controllers/settings.controller';
import { updatePasswordSchema, updateSettingsSchema } from '../validators/settings.validator';

export const settingsRouter = Router();

settingsRouter.get('/', settingsController.get);
settingsRouter.put('/', validateRequest({ body: updateSettingsSchema }), settingsController.update);
settingsRouter.patch(
  '/password',
  validateRequest({ body: updatePasswordSchema }),
  settingsController.updatePassword,
);
