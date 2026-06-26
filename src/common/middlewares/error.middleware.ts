import type { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";

import { AppError } from "../errors/AppError.js";

import { logger } from "../logger/logger.js";

export const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;

  let message = "Internal Server Error";

  let errors: unknown[] = [];

  if (error instanceof AppError) {
    statusCode = error.statusCode;

    message = error.message;
  }

  if (error instanceof ZodError) {
    statusCode = 422;

    message = "Validation Failed";

    errors = error.issues.map((issue) => ({
      field: issue.path.join("."),

      message: issue.message,
    }));
  }

  if (error instanceof Error) {
    logger.error(error.stack);
  }

  return res.status(statusCode).json({
    success: false,

    statusCode,

    message,

    errors,
  });
};
