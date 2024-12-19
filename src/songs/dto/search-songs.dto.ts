import { z } from 'zod';
import { Pagination, PaginationSchema } from '../../dto/pagination.dto';
import { IncludePlayDataSchema, Song, SongSortingSchema } from './songs.dto';

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
  ...IncludePlayDataSchema.shape,
  ...PaginationSchema.shape, // Merge pagination schema into the current schema
  ...SongSortingSchema.shape, // Merge sorting schema into the current schema
});

export type SearchSongCriteriaDto = z.infer<typeof SearchSongCriteriaSchema>;

export type SearchSongResult = {
  data: Song[];
  pagination: Pagination;
};
