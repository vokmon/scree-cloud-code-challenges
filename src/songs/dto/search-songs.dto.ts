import { z } from 'zod';
import { Pagination, PaginationSchema } from '../../dto/pagination.dto';
import { Song } from './songs.dto';
import { getSortingSchema } from '@src/dto/sorting.dto';

const SearchSongSortingSchema = getSortingSchema([
  'songName',
  'albumName',
  'year',
  'totalPlays',
]);

// Validation schema for the "getSongsByYear" query parameters
export const SearchSongCriteriaSchema = z.object({
  year: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val?.length === 0 || /^\d{4}$/.test(val),
      {
        message: 'Year must be a 4-digit number or omitted',
      },
    )
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  keyword: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : undefined))
    .refine((val) => val === undefined || val.length > 0, {
      message: 'Keyword cannot be an empty string',
    }),
  includePlayData: z
    .string()
    .optional()
    .default('false') // Default value as a string
    .refine((val) => ['true', 'false'].includes(val.toLowerCase()), {
      message: 'includePlayData must be "true" or "false"',
    })
    .transform((val) => val.toLowerCase() === 'true'),
  ...PaginationSchema.shape, // Merge pagination schema into the current schema
  ...SearchSongSortingSchema.shape, // Merge sorting schema into the current schema
});

export type SearchSongCriteriaDto = z.infer<typeof SearchSongCriteriaSchema>;

export type SearchSongResult = {
  data: Song[];
  pagination: Pagination;
};
