import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '@src/songs/songs.controller';
import { SongsService } from '@src/songs/songs.service';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import {
  GetTopSongsCriteriaSchema,
  TopSongs,
} from '@src/songs/dto/get-top-songs.dto';

describe('SongsController - Get Top songs by month', () => {
  let controller: SongsController;
  let service: SongsService;
  const pipe = new ZodValidationPipe(GetTopSongsCriteriaSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getTopSongsByMonths: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should call getTopSongsByMonths and return result', async () => {
    // Arrange: Create a mock query and result
    const query = {
      monthYears: [{ month: 1, year: 2024 }],
      limit: 10,
    };

    // Mock the service method to return the result
    vi.spyOn(service, 'getTopSongsByMonths').mockResolvedValue(mockSongs);

    // Act: Call the controller method
    const response = await controller.getTopSongsByMonths(query);

    // Assert: Check that the controller method calls the service and returns the correct response
    expect(response).toEqual(mockSongs);
    expect(service.getTopSongsByMonths).toHaveBeenCalledWith(query);
    expect(service.getTopSongsByMonths).toHaveBeenCalledTimes(1);
  });

  it('should throw validation error for invalid query', async () => {
    // Arrange: Create an invalid query (for example, an invalid month format)
    const invalidQuery = {
      monthYears: 'invalid-format', // Invalid format for monthYears
      limit: '9999',
    };

    await expect(
      pipe.transform(invalidQuery, { type: 'param' }),
    ).rejects.toMatchObject({
      response: {
        message: 'Validation failed',
        errors: [
          {
            field: 'monthYears',
            message: 'Invalid date format, expected YYYY-MM,YYYY-MM,...',
          },
          {
            field: 'limit',
            message: 'Song limit must be less than or equal to 100',
          },
        ],
      },
    });
  });
});

const mockSongs: TopSongs[] = [
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
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
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
            id: 6,
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
