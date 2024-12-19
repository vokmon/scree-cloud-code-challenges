import { z } from 'zod';
import { IncludePlayDataSchema } from './songs.dto';

export const GetSongByIdCriteriaSchema = z.object({
  ...IncludePlayDataSchema.shape,
});
export type GetSongByIdCriteriaDto = z.infer<typeof GetSongByIdCriteriaSchema>;
