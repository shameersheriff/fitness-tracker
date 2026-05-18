import { Router } from 'express';

export const authRouter = Router();

authRouter.get('/status', (_req, res) => {
  res.json({
    success: true,
    message: 'Authentication module is ready for JWT/RBAC integration',
    data: {
      strategy: 'planned',
      supports: ['JWT', 'refresh tokens', 'roles', 'permissions'],
    },
  });
});
