import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from '@src/constants/PaginationConstants';
import { z } from 'zod';

// Reusable pagination schema
export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),

  limit: z
    .string()
    .optional()
    .default(String(DEFAULT_LIMIT))
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= MIN_LIMIT, {
      message: `Limit must be greater than ${MIN_LIMIT - 1}`,
    })
    .refine((val) => val <= MAX_LIMIT, {
      message: `Limit must be less than or equal to ${MAX_LIMIT}`,
    }),
});

export type Pagination = {
  total: number; // Total number of items
  page: number; // Current page number
  limit: number; // Number of items per page
  totalPages: number; // Total number of pages
};
