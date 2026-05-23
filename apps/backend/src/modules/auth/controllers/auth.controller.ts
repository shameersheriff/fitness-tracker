import { created, ok } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import { AuthService } from '../services/auth.service';

const service = new AuthService();

export const authController = {
  register: asyncHandler(async (req, res) => {
    const data = await service.register(req.body);
    return created(res, 'User registered successfully', data);
  }),
  login: asyncHandler(async (req, res) => {
    const data = await service.login(req.body);
    return ok(res, 'Login successful', data);
  }),
  me: asyncHandler(async (req, res) => {
    const data = await service.me(req.userContext.userId);
    return ok(res, 'Authenticated user fetched successfully', data);
  }),
};
