import { Request, Response, NextFunction } from 'express';
import {
  AppError,
  ProblemDetails,
  isAppError,
  InternalServerError,
} from '../../../shared/errors/app-error';
import { logger } from '../../../infrastructure/logger/logger';
import { env } from '../../../shared/constants/env';

/**
 * Centralized error handler middleware
 * Converts all errors to ProblemDetails format (RFC 7807)
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const appError = isAppError(error)
    ? error
    : new InternalServerError(error.message || 'Unknown error');

  const problemDetails = appError.toProblemDetails();
  problemDetails.instance = req.originalUrl;

  // Log error details
  const logLevel =
    appError.statusCode >= 500 ? 'error' : appError.statusCode >= 400 ? 'warn' : 'info';

  logger[logLevel](
    {
      error: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      path: req.originalUrl,
      method: req.method,
      stack: env.NODE_ENV === 'development' ? appError.stack : undefined,
    },
    'Request error'
  );

  // Send error response
  res.status(appError.statusCode).json(problemDetails);
}

