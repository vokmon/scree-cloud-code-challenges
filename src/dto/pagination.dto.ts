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
    .default('10')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Limit must be greater than 0' })
    .refine((val) => val <= 50, {
      message: 'Limit must be less than or equal to 50',
    }),
});

export type Pagination = {
  total: number; // Total number of items
  page: number; // Current page number
  limit: number; // Number of items per page
  totalPages: number; // Total number of pages
};
