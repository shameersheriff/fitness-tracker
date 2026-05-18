import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('file:./dev.db'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  RATE_LIMIT_MAX: z.coerce.number().default(500),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
});

export const env = envSchema.parse(process.env);

export const isProduction = env.NODE_ENV === 'production';
