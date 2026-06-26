import type { NextFunction, Request, Response, RequestHandler } from "express";

/**
 * Wrap async controllers to forward errors
 * to Express error middleware.
 */
export const catchAsync = (handler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
