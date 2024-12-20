import { Song } from './song.dto';

export type Album = {
  id?: number;
  index?: number;
  title: string;
  songs?: Song[];
};
