import { z } from 'zod';
import { IncludeSongDataSchema } from './albums.dto';

export const GetAlbumByIdCriteriaSchema = z.object({
  ...IncludeSongDataSchema.shape,
});

export type GetAlbumByIdCriteriaDto = z.infer<
  typeof GetAlbumByIdCriteriaSchema
>;
