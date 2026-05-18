import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@/common/middleware/errorHandler';
import { notFound } from '@/common/middleware/notFound';
import { applySecurityMiddleware } from '@/common/middleware/security';
import { userContext } from '@/common/middleware/userContext';
import { swaggerDocument } from '@/config/swagger';
import { apiRouter } from '@/routes';

export function createApp() {
  const app = express();

  applySecurityMiddleware(app);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(userContext);

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'Fitness Tracker API is healthy',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/v1', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
