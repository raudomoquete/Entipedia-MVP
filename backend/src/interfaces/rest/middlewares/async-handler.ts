import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to catch errors automatically
 * Ensures errors are passed to error handler middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

