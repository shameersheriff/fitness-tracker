import { prisma } from '@/common/database/prisma';
import { logger } from '@/common/logger/logger';
import { env } from '@/config/env';

import { createApp } from './app';

const app = createApp();

const server = app.listen(env.API_PORT, () => {
  logger.info(`API listening on port ${env.API_PORT}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
