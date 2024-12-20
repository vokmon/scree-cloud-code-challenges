import { Album } from '@src/dto/album.dto';

export const mockAlbumWithoutSongs: Album = {
  id: 1,
  title: '1989',
};

export const mockAlbumWithSongs: Album = {
  id: 1,
  title: '1989',
  songs: [
    {
      index: 1,
      id: 12,
      title: 'All You Had to Do Was Stay',
      totalPlays: 73368,
      year: 2014,
      writers: [
        {
          writer: {
            name: 'Taylor Swift',
          },
        },
      ],
      artists: [
        {
          artist: {
            name: 'Taylor Swift',
          },
        },
      ],
    },
    {
      index: 2,
      id: 24,
      title: 'Blank Space',
      totalPlays: 77349,
      year: 2014,
      writers: [
        {
          writer: {
            name: 'Taylor Swift',
          },
        },
      ],
      artists: [
        {
          artist: {
            name: 'Taylor Swift',
          },
        },
      ],
    },
  ],
};
