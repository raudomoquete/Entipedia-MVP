import { Request, Response, NextFunction } from 'express';
import { Result } from '../../../shared/errors/result';
import {
  AppError,
  ProblemDetails,
  isAppError,
  InternalServerError,
} from '../../../shared/errors/app-error';
import { logger } from '../../../infrastructure/logger/logger';

/**
 * Base API Controller with ProblemDetails support
 * Similar to ASP.NET Core's ApiController pattern
 */
export abstract class BaseController {
  protected readonly logger = logger;

  /**
   * Handles a Result<T> and sends appropriate HTTP response
   */
  protected handleResult<T>(
    result: Result<T, AppError>,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (result.success) {
      this.ok(res, result.value);
    } else {
      this.handleError(result.error, req, res, next);
    }
  }

  /**
   * Handles async operations and converts to Result pattern
   */
  protected async handleAsync<T>(
    operation: () => Promise<T>,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await Result.fromPromise(operation());
      // Convert Error to AppError if needed
      if (!result.success) {
        const appError = isAppError(result.error)
          ? result.error
          : new InternalServerError(result.error.message || 'Unknown error');
        const convertedResult: Result<T, AppError> = Result.failure(appError);
        this.handleResult(convertedResult, req, res, next);
      } else {
        const successResult: Result<T, AppError> = Result.success(result.value);
        this.handleResult(successResult, req, res, next);
      }
    } catch (error) {
      const appError = isAppError(error)
        ? error
        : new InternalServerError(
            error instanceof Error ? error.message : 'Unknown error'
          );
      this.handleError(appError, req, res, next);
    }
  }

  /**
   * Handles errors and converts to ProblemDetails
   */
  protected handleError(
    error: AppError | Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    const appError = isAppError(error)
      ? error
      : new InternalServerError(error.message || 'Unknown error');

    const problemDetails = appError.toProblemDetails();
    problemDetails.instance = req.originalUrl;

    this.logger.error(
      {
        error: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        stack: appError.stack,
      },
      'Request failed'
    );

    res.status(appError.statusCode).json(problemDetails);
  }

  /**
   * Sends 200 OK response
   */
  protected ok<T>(res: Response, data?: T): void {
    if (data !== undefined) {
      res.status(200).json(data);
    } else {
      res.status(200).send();
    }
  }

  /**
   * Sends 201 Created response
   */
  protected created<T>(res: Response, data: T, location?: string): void {
    if (location) {
      res.location(location);
    }
    res.status(201).json(data);
  }

  /**
   * Sends 204 No Content response
   */
  protected noContent(res: Response): void {
    res.status(204).send();
  }

  /**
   * Sends 400 Bad Request response
   */
  protected badRequest(res: Response, message?: string): void {
    const problemDetails: ProblemDetails = {
      type: 'BAD_REQUEST',
      title: 'Bad Request',
      status: 400,
      detail: message || 'Bad request',
    };
    res.status(400).json(problemDetails);
  }

  /**
   * Sends 404 Not Found response
   */
  protected notFound(res: Response, message?: string): void {
    const problemDetails: ProblemDetails = {
      type: 'NOT_FOUND',
      title: 'Not Found',
      status: 404,
      detail: message || 'Resource not found',
    };
    res.status(404).json(problemDetails);
  }

  /**
   * Sends 500 Internal Server Error response
   */
  protected serverError(res: Response, message?: string): void {
    const problemDetails: ProblemDetails = {
      type: 'INTERNAL_SERVER_ERROR',
      title: 'Internal Server Error',
      status: 500,
      detail: message || 'An internal server error occurred',
    };
    res.status(500).json(problemDetails);
  }
}

