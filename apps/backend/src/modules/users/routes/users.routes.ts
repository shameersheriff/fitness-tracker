import { Router } from 'express';

import { prisma } from '@/common/database/prisma';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { ok } from '@/common/utils/apiResponse';

export const usersRouter = Router();

usersRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const user = req.userContext.userId
      ? await prisma.user.findUnique({ where: { id: req.userContext.userId } })
      : await prisma.user.findFirst({ where: { deletedAt: null }, orderBy: { createdAt: 'asc' } });

    return ok(res, 'User profile fetched successfully', user);
  }),
);
