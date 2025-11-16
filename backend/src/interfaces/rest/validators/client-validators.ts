import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['PERSON', 'COMPANY']),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(3).optional(),
  lifetimeValue: z.number().nonnegative().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['PERSON', 'COMPANY']).optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(3).optional(),
  lifetimeValue: z.number().nonnegative().optional(),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : 10)),
});


