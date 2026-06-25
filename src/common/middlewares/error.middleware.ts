import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
