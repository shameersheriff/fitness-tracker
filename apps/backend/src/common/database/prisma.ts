import { PrismaClient } from '@prisma/client';

import { logger } from '@/common/logger/logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (event) => {
  logger.error('Prisma error', { message: event.message, target: event.target });
});

prisma.$on('warn', (event) => {
  logger.warn('Prisma warning', { message: event.message, target: event.target });
});
