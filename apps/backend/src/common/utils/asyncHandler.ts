import type { NextFunction, Request, Response } from 'express';

type AsyncController = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(controller: AsyncController) {
  return (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
}
