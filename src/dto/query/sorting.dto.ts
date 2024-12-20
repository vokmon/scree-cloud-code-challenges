import { z } from 'zod';

export const getSortingSchema = (sortableFields: string[]) =>
  z.object({
    orderBy: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) {
            return true;
          }
          // Split the comma-separated string into an array and validate each element
          const fields = val.split(',').map((field) => field.trim());
          return fields.every((field) => sortableFields.includes(field));
        },
        {
          message: `Invalid orderBy value. Use ${sortableFields.join(', ')}`,
        },
      )
      .transform((val) => val?.split(',')?.map((field) => field.trim())), // Convert to an array of strings

    orderDirection: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({
          message: 'Invalid orderDirection value. Use "asc" or "desc"',
        }),
      })
      .optional()
      .default('asc'), // Default sorting direction if not provided
  });

type SortingSchema = z.infer<ReturnType<typeof getSortingSchema>>;

export type OrderDirectionType = SortingSchema['orderDirection'];
