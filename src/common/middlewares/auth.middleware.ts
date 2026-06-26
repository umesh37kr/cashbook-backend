import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { UnauthorizedError } from "../errors/AppError.js";
import { verifyToken } from "../helpers/jwt.helper.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token is required");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Access token is required");
    }

    const payload = verifyToken(token, env.JWT.ACCESS_SECRET);

    if (payload.type !== "access") {
      throw new UnauthorizedError("Invalid access token");
    }

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }

    next(new UnauthorizedError("Invalid or expired access token"));
  }
};
