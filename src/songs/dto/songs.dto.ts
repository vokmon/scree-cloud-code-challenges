import { getSortingSchema } from '@src/dto/sorting.dto';
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

export type Song = {
  index: number;
  title: string;
  album: SongAlbum;
  year: number;
  totalPlays: number;
  plays?: PlayData[];
};

export type SongAlbum = {
  title: string;
};

export type PlayData = {
  month: number;
  year: number;
  playCount: number;
};
