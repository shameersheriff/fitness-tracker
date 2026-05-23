import { Router } from 'express';

import { validateRequest } from '@/common/middleware/validateRequest';

import { authController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), authController.register);
authRouter.post('/login', validateRequest({ body: loginSchema }), authController.login);
authRouter.get('/me', authController.me);
