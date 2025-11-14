/**
 * Result type similar to C# ErrorOr pattern
 * Represents either a success value or an error
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Helper functions for Result type
 */
export const Result = {
  /**
   * Creates a successful result
   */
  success: <T>(value: T): Result<T, never> => ({
    success: true,
    value,
  }),

  /**
   * Creates a failed result
   */
  failure: <E>(error: E): Result<never, E> => ({
    success: false,
    error,
  }),

  /**
   * Wraps a promise that might throw into a Result
   */
  fromPromise: async <T>(
    promise: Promise<T>
  ): Promise<Result<T, Error>> => {
    try {
      const value = await promise;
      return Result.success(value);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  },

  /**
   * Wraps a function that might throw into a Result
   */
  fromThrowable: <T, Args extends unknown[]>(
    fn: (...args: Args) => T
  ): ((...args: Args) => Result<T, Error>) => {
    return (...args: Args) => {
      try {
        return Result.success(fn(...args));
      } catch (error) {
        return Result.failure(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
  },
};

