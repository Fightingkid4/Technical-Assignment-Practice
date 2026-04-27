import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError, isAppError } from "../errors/app-error";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.flatten()
      }
    });
  }

  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: "Internal server error"
    }
  });
};