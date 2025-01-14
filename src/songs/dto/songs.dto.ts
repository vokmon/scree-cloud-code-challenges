import { getSortingSchema } from '@src/dto/query/sorting.dto';
import { z } from 'zod';

export const IncludePlayDataSchema = z.object({
  includePlayData: z
    .string()
    .optional()
    .default('false') // Default value as a string
    .refine((val) => ['true', 'false'].includes(val.toLowerCase()), {
      message: 'includePlayData must be "true" or "false"',
    })
    .transform((val) => val.toLowerCase() === 'true'),
});

export const SongSortingSchema = getSortingSchema([
  'songName',
  'albumName',
  'year',
  'totalPlays',
]);
