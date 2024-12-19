import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '@src/songs/songs.controller';
import { SongsService } from '@src/songs/songs.service';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import {
  GetSongByIdCriteriaDto,
  GetSongByIdCriteriaSchema,
} from '@src/songs/dto/get-songs-by-id.dto';

describe('SongsController - Get Song by Id', () => {
  let controller: SongsController;
  let service: SongsService;
  const pipe = new ZodValidationPipe(GetSongByIdCriteriaSchema);

  const mockSong = {
    index: 1,
    title: 'Clean',
    year: 2014,
    totalPlays: 98869,
    album: {
      id: 1,
      title: '1989',
    },
    plays: [
      {
        month: 1,
        year: 2024,
        playCount: 206,
      },
    ],
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
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getSongById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should return a song when found', async () => {
    const songId = 1;
    const query: GetSongByIdCriteriaDto = { includePlayData: true }; // Example query

    // Mock the service method to return a song
    vi.spyOn(service, 'getSongById').mockResolvedValue(mockSong);

    const result = await controller.getSongById(songId, query);

    // Check if the song returned has the `index` added
    expect(result).toEqual({ ...mockSong });
    expect(service.getSongById).toHaveBeenCalledWith(songId, query);
  });

  it('should return an empty object if no song is found', async () => {
    const songId = 1;
    const query: GetSongByIdCriteriaDto = { includePlayData: true }; // Example query

    // Mock the service method to return null
    vi.spyOn(service, 'getSongById').mockResolvedValue(null);

    const result = await controller.getSongById(songId, query);

    // Check if an empty object is returned
    expect(result).toEqual({});
    expect(service.getSongById).toHaveBeenCalledWith(songId, query);
  });

  it('should throw BadRequestException if query is invalid', async () => {
    const invalidQuery = { includePlayData: 'invalid' }; // Invalid query to trigger validation error

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
        ],
      },
    });
  });
});
