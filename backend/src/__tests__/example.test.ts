import { Result } from '../shared/errors/result';
import {
  AppError,
  NotFoundError,
  ValidationError,
} from '../shared/errors/app-error';

describe('Result Pattern', () => {
  it('should create a successful result', () => {
    const result = Result.success(42);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(42);
    }
  });

  it('should create a failed result', () => {
    const error = new Error('Test error');
    const result = Result.failure(error);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success');
    const result = await Result.fromPromise(promise);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('success');
    }
  });
});

describe('AppError', () => {
  it('should convert to ProblemDetails', () => {
    const error = new NotFoundError('User', '123');
    const problemDetails = error.toProblemDetails();

    expect(problemDetails.type).toBe('NOT_FOUND');
    expect(problemDetails.title).toBe('NotFoundError');
    expect(problemDetails.status).toBe(404);
    expect(problemDetails.detail).toContain('User');
  });

  it('should create ValidationError with details', () => {
    const errors = { email: ['Email is required'], age: ['Age must be positive'] };
    const error = new ValidationError('Validation failed', errors);
    const problemDetails = error.toProblemDetails();

    expect(problemDetails.status).toBe(400);
    expect((problemDetails as any).errors).toEqual(errors);
  });
});

