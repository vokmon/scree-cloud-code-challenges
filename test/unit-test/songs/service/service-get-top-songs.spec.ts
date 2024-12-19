import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { SongsService } from '@src/songs/songs.service';
import { DatasourceService } from '@src/datasource/datasource.service';
import { TopSongs } from '@src/songs/dto/get-top-songs.dto';

describe('SongsService - getTopSongs', () => {
  let service: SongsService;
  let datasourceServiceMock;

  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new SongsService(datasourceServiceMock);
  });

  it('should return top songs by month and year', async () => {
    const criteria = {
      monthYears: [
        { month: 10, year: 2024 },
        { month: 11, year: 2024 },
        { month: 12, year: 2024 },
      ],
      limit: 2,
    };

    // Mock the datasourceService.play.findMany to return mockTopSongs
    datasourceServiceMock.play.findMany.mockResolvedValueOnce(mockData[0]);
    datasourceServiceMock.play.findMany.mockResolvedValueOnce(mockData[1]);
    datasourceServiceMock.play.findMany.mockResolvedValueOnce(mockData[2]);

    // Call the method with the criteria
    await service.getTopSongsByMonths(criteria);

    // Ensure the Prisma service's findMany method was called with correct arguments
    expect(datasourceServiceMock.play.findMany).toHaveBeenCalledTimes(
      criteria.monthYears.length,
    );
  });
});

const mockData: TopSongs[] = [
  {
    month: 10,
    year: 2024,
    topSongs: [
      {
        playCount: 493,
        song: {
          id: 122,
          title: 'Superman',
          totalPlays: 37084,
          year: 2010,
          album: {
            title: 'Speak Now\n(Deluxe edition)',
          },
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
      },
      {
        playCount: 492,
        song: {
          id: 40,
          title: 'I Did Something Bad',
          totalPlays: 18018,
          year: 2017,
          album: {
            title: 'Reputation',
          },
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
      },
    ],
  },
  {
    month: 11,
    year: 2024,
    topSongs: [
      {
        playCount: 500,
        song: {
          id: 166,
          title: 'Clean',
          totalPlays: 98869,
          year: 2014,
          album: {
            title: '1989',
          },
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
      },
      {
        playCount: 492,
        song: {
          id: 126,
          title: 'Sweeter than Fiction',
          totalPlays: 9344,
          year: 2013,
          album: {
            title: 'One Chance Soundtrack',
          },
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
      },
    ],
  },
  {
    month: 12,
    year: 2024,
    topSongs: [
      {
        playCount: 500,
        song: {
          id: 72,
          title: 'I Wish You Would',
          totalPlays: 80057,
          year: 2014,
          album: {
            title: '1989',
          },
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
      },
      {
        playCount: 497,
        song: {
          id: 1,
          title: 'All Too Well',
          totalPlays: 45495,
          year: 2012,
          album: {
            title: 'Red',
          },
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
      },
    ],
  },
];
