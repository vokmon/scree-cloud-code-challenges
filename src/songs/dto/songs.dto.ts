export type Song = {
  index: number;
  title: string;
  album: SongAlbum;
  year: number;
  totalPlays: number;
  plays?: PlayData[];
};

export type SongAlbum = {
  id: number;
  title: string;
};

export type PlayData = {
  month: number;
  year: number;
  playCount: number;
};
