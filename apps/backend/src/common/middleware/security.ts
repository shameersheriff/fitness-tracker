import compression from 'compression';
import cors from 'cors';
import type { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { env, isProduction } from '@/config/env';

export function applySecurityMiddleware(app: Express) {
  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: isProduction ? env.FRONTEND_URL : true,
      credentials: true,
    }),
  );
  app.use(
    rateLimit({
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      windowMs: env.RATE_LIMIT_WINDOW_MS,
    }),
  );
  app.use(morgan(isProduction ? 'combined' : 'dev'));
}
