import { Pagination, PaginationSchema } from '@src/dto/query/pagination.dto';
import { z } from 'zod';
import { AlbumSortingSchema, IncludeSongDataSchema } from './albums.dto';
import { Album } from '@src/dto/album.dto';

// Validation schema for the "getSongsByYear" query parameters
export const SearchAlbumCriteriaSchema = z.object({
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
  ...IncludeSongDataSchema.shape,
  ...PaginationSchema.shape, // Merge pagination schema into the current schema
  ...AlbumSortingSchema.shape, // Merge sorting schema into the current schema
});

export type SearchAlbumCriteriaDto = z.infer<typeof SearchAlbumCriteriaSchema>;

export type SearchAlbumResult = {
  data: Album[];
  pagination: Pagination;
};
