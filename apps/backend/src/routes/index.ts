import { Router } from 'express';

import { analyticsRouter } from '@/modules/analytics/routes/analytics.routes';
import { authRouter } from '@/modules/auth/routes/auth.routes';
import { dashboardRouter } from '@/modules/dashboard/routes/dashboard.routes';
import { goalsRouter } from '@/modules/goals/routes/goals.routes';
import { habitsRouter } from '@/modules/habits/routes/habits.routes';
import { mealsRouter } from '@/modules/meals/routes/meals.routes';
import { nutritionRouter } from '@/modules/nutrition/routes/nutrition.routes';
import { progressRouter } from '@/modules/progress/routes/progress.routes';
import { schedulesRouter } from '@/modules/schedules/routes/schedules.routes';
import { settingsRouter } from '@/modules/settings/routes/settings.routes';
import { usersRouter } from '@/modules/users/routes/users.routes';
import { workoutSessionsRouter } from '@/modules/workout-sessions/routes/workout-sessions.routes';
import { workoutTypesRouter } from '@/modules/workout-types/routes/workout-types.routes';
import { workoutsRouter } from '@/modules/workouts/routes/workouts.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API v1 is healthy',
    data: {
      version: 'v1',
    },
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/workout-types', workoutTypesRouter);
apiRouter.use('/workouts', workoutsRouter);
apiRouter.use('/schedules', schedulesRouter);
apiRouter.use('/workout-sessions', workoutSessionsRouter);
apiRouter.use('/meals', mealsRouter);
apiRouter.use('/nutrition', nutritionRouter);
apiRouter.use('/goals', goalsRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/habits', habitsRouter);
