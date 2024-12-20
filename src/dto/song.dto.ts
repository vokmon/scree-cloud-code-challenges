import { Artist, Writer } from './person.dto';
import { PlayData } from './play-data.dto';

export type Song = {
  index?: number;
  id?: number;
  title: string;
  year: number;
  album?: SongAlbum;
  totalPlays: number;
  writers: Writer[];
  artists: Artist[];
  plays?: PlayData[];
};

export type SongAlbum = {
  id: number;
  title: string;
};
