import { Result } from './result';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error to a ProblemDetails object (RFC 7807)
   */
  toProblemDetails(): ProblemDetails {
    const problemDetails: ProblemDetails = {
      type: this.code,
      title: this.name,
      status: this.statusCode,
      detail: this.message,
    };

    if (this.details) {
      Object.assign(problemDetails, this.details);
    }

    return problemDetails;
  }
}

/**
 * Problem Details for HTTP APIs (RFC 7807)
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}

/**
 * Common application errors
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      `${resource}${identifier ? ` with id ${identifier}` : ''} not found`,
      'NOT_FOUND',
      404,
      { resource, identifier }
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400, { errors });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFLICT', 409, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An internal server error occurred') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Converts an unknown error to a Result
 */
export function toResult<T>(
  valueOrError: T | Error | AppError
): Result<T, AppError> {
  if (valueOrError instanceof Error) {
    if (isAppError(valueOrError)) {
      return Result.failure(valueOrError);
    }
    return Result.failure(
      new InternalServerError(valueOrError.message || 'Unknown error')
    );
  }
  return Result.success(valueOrError);
}

