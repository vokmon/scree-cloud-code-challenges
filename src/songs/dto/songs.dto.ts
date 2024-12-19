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
  index?: number;
  id?: number;
  title: string;
  album: SongAlbum;
  year: number;
  totalPlays: number;
  writers: Writer[];
  artists: Artist[];
  plays?: PlayData[];
};

export type Writer = {
  writer: Person;
};

export type Artist = {
  artist: Person;
};

export type Person = {
  name: string;
};

export type SongAlbum = {
  title: string;
};

export type PlayData = {
  month: number;
  year: number;
  playCount: number;
};
