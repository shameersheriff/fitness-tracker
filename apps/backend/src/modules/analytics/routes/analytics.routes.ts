import { Router } from 'express';

import { analyticsController } from '../controllers/analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/workouts', analyticsController.workouts);
analyticsRouter.get('/nutrition', analyticsController.nutrition);
analyticsRouter.get('/progress', analyticsController.progress);
