import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '@src/songs/songs.controller';
import { SongsService } from '@src/songs/songs.service';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { Song } from '@src/dto/song.dto';
import { MAX_LIMIT } from '@src/constants/PaginationConstants';
import { GetRecommendationSongsCriteriaSchema } from '@src/songs/dto/get-recommendation-songs.dto';

describe('SongsController - Get Recommended songs', () => {
  let controller: SongsController;
  let service: SongsService;
  const pipe = new ZodValidationPipe(GetRecommendationSongsCriteriaSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getRecommendationSongs: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should return a list of recommended songs', async () => {
    const mockQuery = {
      limit: 5,
      orderBy: ['songName'],
      includePlayData: true,
    };

    vi.spyOn(service, 'getRecommendationSongs').mockResolvedValue(mockSongs);

    const result = await controller.getRecommendationSongs(mockQuery);

    expect(service.getRecommendationSongs).toHaveBeenCalledWith(mockQuery);
    expect(result).toEqual(mockSongs);
  });

  it('should throw BadRequestException when validation fails', async () => {
    const invalidQuery = {
      includePlayData: 'invalid',
      limit: String(MAX_LIMIT + 1),
      orderBy: 'invalid',
      orderDirection: 'invalid',
    };

    await expect(
      pipe.transform(invalidQuery, { type: 'param' }),
    ).rejects.toMatchObject({
      response: {
        message: 'Validation failed',
        errors: [
          {
            field: 'includePlayData',
            message: 'includePlayData must be "true" or "false"',
          },
          {
            field: 'orderBy',
            message:
              'Invalid orderBy value. Use songName, albumName, year, totalPlays',
          },
          {
            field: 'orderDirection',
            message: 'Invalid orderDirection value. Use "asc" or "desc"',
          },
          {
            field: 'limit',
            message: 'Limit must be less than or equal to 100',
          },
        ],
      },
    });
  });
});

const mockSongs: Song[] = [
  {
    index: 1,
    title: 'Forever & Always (piano version)',
    year: 2009,
    totalPlays: 75551,
    album: {
      id: 1,
      title: 'Fearless\n(Platinum edition)',
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
  {
    index: 2,
    title: 'Picture to Burn',
    year: 2006,
    totalPlays: 6680,
    album: {
      id: 2,
      title: 'Taylor Swift',
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
  {
    index: 3,
    title: 'Tied Together with a Smile',
    year: 2006,
    totalPlays: 15608,
    album: {
      id: 3,
      title: 'Taylor Swift',
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
];
