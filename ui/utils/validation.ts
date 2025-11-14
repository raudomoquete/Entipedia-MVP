import { z } from 'zod';

/**
 * Utility functions for form validation using Zod
 */

/**
 * Common validation schemas
 */
export const validationSchemas = {
  email: z.string().email('Email inválido'),
  requiredString: z.string().min(1, 'Este campo es requerido'),
  optionalString: z.string().optional(),
  url: z.string().url('URL inválida'),
  positiveNumber: z.number().positive('Debe ser un número positivo'),
  nonNegativeNumber: z.number().nonnegative('Debe ser un número no negativo'),
};

/**
 * Helper to extract error messages from Zod errors
 */
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  return errors;
}

/**
 * Helper to format field errors for display
 */
export function formatFieldError(field: string, errors: Record<string, string>): string | undefined {
  return errors[field];
}

