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

export const mockSearchAlbumDataWithoutSongs = {
  data: [
    {
      index: 1,
      id: 1,
      title: 'None[b]',
    },
    {
      index: 2,
      id: 2,
      title: '1989',
    },
    {
      index: 3,
      id: 3,
      title: 'Cats: Highlights from the Motion Picture Soundtrack',
    },
    {
      index: 4,
      id: 4,
      title: 'None',
    },
    {
      index: 5,
      id: 5,
      title: 'AT&T Team USA Soundtrack and Fearless',
    },
    {
      index: 6,
      id: 6,
      title: 'Beautiful Eyes',
    },
    {
      index: 7,
      id: 7,
      title: 'Hannah Montana: The Movie',
    },
    {
      index: 8,
      id: 8,
      title: 'Two Lanes of Freedom',
    },
    {
      index: 9,
      id: 9,
      title: 'Live in No Shoes Nation',
    },
    {
      index: 10,
      id: 10,
      title: 'Bigger',
    },
  ],
  pagination: {
    total: 39,
    page: 1,
    limit: 10,
    totalPages: 4,
  },
};

export const mockSearchAlbumDataWithSongs = {
  data: [
    {
      index: 1,
      id: 1,
      title: 'None[b]',
      songs: [
        {
          index: 1,
          id: 6,
          title: 'Bad Blood (remixed single version)',
          totalPlays: 24565,
          year: 2015,
          writers: [
            {
              writer: {
                name: 'Taylor Swift',
              },
            },
            {
              writer: {
                name: 'Kendrick Lamar',
              },
            },
          ],
          artists: [
            {
              artist: {
                name: 'Taylor Swift',
              },
            },
            {
              artist: {
                name: 'Kendrick Lamar',
              },
            },
          ],
        },
      ],
    },
    {
      index: 2,
      id: 2,
      title: '1989',
      songs: [
        {
          index: 1,
          id: 10,
          title: 'Bad Blood (album version)',
          totalPlays: 1572,
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
          id: 22,
          title: 'How You Get the Girl',
          totalPlays: 16992,
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
          index: 3,
          id: 58,
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
        {
          index: 4,
          id: 91,
          title: 'Out of the Woods',
          totalPlays: 65754,
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
          index: 5,
          id: 125,
          title: 'Shake It Off',
          totalPlays: 17120,
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
          index: 6,
          id: 147,
          title: 'Wildest Dreams',
          totalPlays: 53374,
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
          index: 7,
          id: 18,
          title: 'Clean',
          totalPlays: 98869,
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
          index: 8,
          id: 148,
          title: 'Welcome to New York',
          totalPlays: 63570,
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
          index: 9,
          id: 14,
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
          index: 10,
          id: 70,
          title: 'I Know Places',
          totalPlays: 12546,
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
          index: 11,
          id: 159,
          title: 'This Love',
          totalPlays: 81444,
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
          index: 12,
          id: 29,
          title: 'I Wish You Would',
          totalPlays: 80057,
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
          index: 13,
          id: 127,
          title: 'Style',
          totalPlays: 66841,
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
    },
    {
      index: 3,
      id: 3,
      title: 'Cats: Highlights from the Motion Picture Soundtrack',
      songs: [
        {
          index: 1,
          id: 1,
          title: 'Beautiful Ghosts',
          totalPlays: 80405,
          year: 2019,
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
          id: 73,
          title: 'Macavity (cover)',
          totalPlays: 64406,
          year: 2019,
          writers: [
            {
              writer: {
                name: 'Idris Elba',
              },
            },
            {
              writer: {
                name: 'Taylor Swift',
              },
            },
          ],
          artists: [
            {
              artist: {
                name: 'Idris Elba',
              },
            },
            {
              artist: {
                name: 'Taylor Swift',
              },
            },
          ],
        },
      ],
    },
    {
      index: 4,
      id: 4,
      title: 'None',
      songs: [
        {
          index: 1,
          id: 44,
          title: "I'd Lie",
          totalPlays: 40903,
          year: 2006,
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
          id: 114,
          title: 'Christmas Tree Farm',
          totalPlays: 81759,
          year: 2019,
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
          index: 3,
          id: 120,
          title: 'Only the Young',
          totalPlays: 73545,
          year: 2020,
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
          index: 4,
          id: 170,
          title: 'Ronan',
          totalPlays: 65474,
          year: 2012,
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
    },
    {
      index: 5,
      id: 5,
      title: 'AT&T Team USA Soundtrack and Fearless',
      songs: [
        {
          index: 1,
          id: 101,
          title: 'Change',
          totalPlays: 2674,
          year: 2008,
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
    },
    {
      index: 6,
      id: 6,
      title: 'Beautiful Eyes',
      songs: [
        {
          index: 1,
          id: 8,
          title: 'Beautiful Eyes',
          totalPlays: 418,
          year: 2008,
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
          id: 59,
          title: 'I Heart ?',
          totalPlays: 53838,
          year: 2008,
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
    },
    {
      index: 7,
      id: 7,
      title: 'Hannah Montana: The Movie',
      songs: [
        {
          index: 1,
          id: 43,
          title: 'Crazier',
          totalPlays: 85486,
          year: 2009,
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
    },
    {
      index: 8,
      id: 8,
      title: 'Two Lanes of Freedom',
      songs: [
        {
          index: 1,
          id: 20,
          title: "Highway Don't Care",
          totalPlays: 52000,
          year: 2013,
          writers: [
            {
              writer: {
                name: 'Taylor Swift',
              },
            },
            {
              writer: {
                name: 'Keith Urban',
              },
            },
            {
              writer: {
                name: 'Tim McGraw and Taylor Swift',
              },
            },
          ],
          artists: [
            {
              artist: {
                name: 'Keith Urban',
              },
            },
            {
              artist: {
                name: 'Tim McGraw and Taylor Swift',
              },
            },
            {
              artist: {
                name: 'Taylor Swift',
              },
            },
          ],
        },
      ],
    },
    {
      index: 9,
      id: 9,
      title: 'Live in No Shoes Nation',
      songs: [
        {
          index: 1,
          id: 56,
          title: 'Big Star (Live)',
          totalPlays: 53687,
          year: 2017,
          writers: [
            {
              writer: {
                name: 'Taylor Swift',
              },
            },
            {
              writer: {
                name: 'Kenny Chesney',
              },
            },
          ],
          artists: [
            {
              artist: {
                name: 'Taylor Swift',
              },
            },
            {
              artist: {
                name: 'Kenny Chesney',
              },
            },
          ],
        },
      ],
    },
    {
      index: 10,
      id: 10,
      title: 'Bigger',
      songs: [
        {
          index: 1,
          id: 11,
          title: 'Babe',
          totalPlays: 30133,
          year: 2018,
          writers: [
            {
              writer: {
                name: 'Taylor Swift',
              },
            },
            {
              writer: {
                name: 'Sugarland',
              },
            },
          ],
          artists: [
            {
              artist: {
                name: 'Taylor Swift',
              },
            },
            {
              artist: {
                name: 'Sugarland',
              },
            },
          ],
        },
      ],
    },
  ],
  pagination: {
    total: 39,
    page: 1,
    limit: 10,
    totalPages: 4,
  },
};
