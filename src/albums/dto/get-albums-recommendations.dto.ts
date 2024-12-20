import { z } from 'zod';
import { PaginationSchema } from '@src/dto/query/pagination.dto';
import { AlbumSortingSchema, IncludeSongDataSchema } from './albums.dto';

const LimitSchema = PaginationSchema.pick({
  limit: true,
});

export const GetRecommendationAlbumsCriteriaSchema = z.object({
  ...IncludeSongDataSchema.shape,
  ...AlbumSortingSchema.shape,
  ...LimitSchema.shape,
});

export type GetRecommendationAlbumsCriteriaDto = z.infer<
  typeof GetRecommendationAlbumsCriteriaSchema
>;
