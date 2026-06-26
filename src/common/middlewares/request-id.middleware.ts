import type { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.header("X-Request-Id") ?? uuid();

  req.headers["x-request-id"] = id;

  res.setHeader("X-Request-Id", id);
  next();
};
