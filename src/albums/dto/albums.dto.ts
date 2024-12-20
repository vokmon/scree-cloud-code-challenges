import { getSortingSchema } from '@src/dto/query/sorting.dto';
import { z } from 'zod';

export const IncludeSongDataSchema = z.object({
  includeSongData: z
    .string()
    .optional()
    .default('false') // Default value as a string
    .refine((val) => ['true', 'false'].includes(val.toLowerCase()), {
      message: 'includeSongData must be "true" or "false"',
    })
    .transform((val) => val.toLowerCase() === 'true'),
});

export const AlbumSortingSchema = getSortingSchema(['albumName']);
