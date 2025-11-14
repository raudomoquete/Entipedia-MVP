import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base-controller';
import { asyncHandler } from '../middlewares/async-handler';
import { Result } from '../../../shared/errors/result';
import { NotFoundError } from '../../../shared/errors/app-error';

/**
 * Example controller showing how to use BaseController
 * Controllers should inherit from BaseController to get ProblemDetails support
 */
export class ExampleController extends BaseController {
  /**
   * Example: Using handleAsync for async operations
   */
  public getExample = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.handleAsync(async () => {
        // Simulate an async operation
        const result: Result<string, NotFoundError> = Result.success('Example data');
        if (!result.success) {
          throw result.error;
        }
        return result.value;
      }, req, res, next);
    }
  );

  /**
   * Example: Using handleResult for Result pattern
   */
  public getById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      // Simulate a service call that returns Result
      const result: Result<{ id: string; name: string }, NotFoundError> =
        id === '123'
          ? Result.success({ id, name: 'Example' })
          : Result.failure(new NotFoundError('Example', id));

      this.handleResult(result, req, res, next);
    }
  );

  /**
   * Example: Direct HTTP response methods
   */
  public create = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const data = req.body;

      // Validate input
      if (!data.name) {
        this.badRequest(res, 'Name is required');
        return;
      }

      // Simulate creation
      const created = { id: '123', ...data };
      this.created(res, created, `/api/v1/examples/${created.id}`);
    }
  );

  /**
   * Example: Using helper methods
   */
  public delete = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!id) {
        this.badRequest(res, 'ID is required');
        return;
      }

      // Simulate deletion
      this.noContent(res);
    }
  );
}

