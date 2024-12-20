import { z } from 'zod';
import { IncludePlayDataSchema, SongSortingSchema } from './songs.dto';
import { PaginationSchema } from '@src/dto/query/pagination.dto';

const LimitSchema = PaginationSchema.pick({
  limit: true,
});

export const GetRecommendationCriteriaSchema = z.object({
  ...IncludePlayDataSchema.shape,
  ...SongSortingSchema.shape,
  ...LimitSchema.shape,
});

export type GetRecommendationCriteriaDto = z.infer<
  typeof GetRecommendationCriteriaSchema
>;
