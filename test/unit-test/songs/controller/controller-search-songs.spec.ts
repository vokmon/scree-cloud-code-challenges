import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '@src/songs/songs.controller';
import { SongsService } from '@src/songs/songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongCriteriaSchema,
  SearchSongResult,
} from '@src/songs/dto/search-songs.dto';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { MAX_LIMIT } from '@src/constants/PaginationConstants';

describe('SongsController - Search Songs', () => {
  let controller: SongsController;
  let service: SongsService;
  const pipe = new ZodValidationPipe(SearchSongCriteriaSchema);

  const mockResult: SearchSongResult = {
    data: [
      {
        index: 0,
        title: 'Song A',
        year: 2022,
        totalPlays: 100,
        album: {
          title: 'Album A',
        },
      },
    ],
    pagination: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            searchSongs: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should call SongsService.searchSongs with valid criteria', async () => {
    const mockQuery = {
      year: '2022',
      keyword: 'rock',
      includePlayData: 'true',
      page: '1',
      limit: '10',
      orderBy: 'songName',
      orderDirection: 'asc',
    };

    vi.spyOn(service, 'searchSongs').mockResolvedValue(mockResult);

    const result = await controller.searchSongs(
      mockQuery as unknown as SearchSongCriteriaDto,
    );

    expect(service.searchSongs).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('should throw BadRequestException when validation fails', async () => {
    const invalidQuery = {
      year: 'invalid-year', // Not a valid year format
      page: '0', // Invalid page number
      limit: String(MAX_LIMIT + 1), // Exceeds the limit
    };

    await expect(
      pipe.transform(invalidQuery, { type: 'param' }),
    ).rejects.toMatchObject({
      response: {
        message: 'Validation failed',
        errors: [
          {
            field: 'year',
            message: 'Year must be a 4-digit number or omitted',
          },
          { field: 'page', message: 'Page must be greater than 0' },
          { field: 'limit', message: 'Limit must be less than or equal to 50' },
        ],
      },
    });
  });

  it('should handle default values for optional parameters', async () => {
    const mockQuery = {
      page: '1',
      limit: '10',
    };

    const query = await pipe.transform(mockQuery, { type: 'param' });
    vi.spyOn(service, 'searchSongs').mockResolvedValue(mockResult);

    const result = await controller.searchSongs(query);

    expect(service.searchSongs).toHaveBeenCalledWith({
      includePlayData: false,
      orderBy: undefined,
      orderDirection: 'asc',
      limit: 10,
      page: 1,
    });

    expect(result).toEqual(mockResult);
  });

  it('should validate sorting parameters', async () => {
    const invalidQuery = {
      page: '1',
      limit: '10',
      orderBy: 'invalidField',
      orderDirection: 'desc',
    };

    await expect(
      pipe.transform(invalidQuery, { type: 'param' }),
    ).rejects.toMatchObject({
      response: {
        message: 'Validation failed',
        errors: [
          {
            field: 'orderBy',
            message:
              'Invalid orderBy value. Use songName, albumName, year, totalPlays',
          },
        ],
      },
    });
  });

  it('should return data when no search criteria is provided', async () => {
    const mockQuery: SearchSongCriteriaDto = {}; // Empty criteria

    vi.spyOn(service, 'searchSongs').mockResolvedValue(mockResult);

    const query = await pipe.transform(mockQuery, { type: 'param' });
    const result = await controller.searchSongs(query);

    expect(service.searchSongs).toHaveBeenCalledWith({
      includePlayData: false,
      page: 1,
      limit: 10,
      orderBy: undefined,
      orderDirection: 'asc',
    });
    expect(result).toEqual(mockResult);
  });
});
