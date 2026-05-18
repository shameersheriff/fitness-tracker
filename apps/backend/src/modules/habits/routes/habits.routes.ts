import { Router } from 'express';

import { prisma } from '@/common/database/prisma';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { ok } from '@/common/utils/apiResponse';

export const habitsRouter = Router();

habitsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const logs = await prisma.habitLog.findMany({
      where: { userId: req.userContext.userId },
      orderBy: { logDate: 'desc' },
      take: 30,
    });

    return ok(res, 'Habit logs fetched successfully', logs);
  }),
);
