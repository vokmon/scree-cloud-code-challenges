import { vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '@src/songs/songs.controller';
import { SongsService } from '@src/songs/songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongResult,
} from '@src/songs/dto/search-songs.dto';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  const mockResult: SearchSongResult = {
    data: [
      {
        index: 0,
        title: 'Song A',
        year: 2022,
        totalPlays: 100,
        album: {
          title: 'Album A',
          id: 0,
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
      limit: '100', // Exceeds the limit
    };

    await expect(controller.searchSongs(invalidQuery as any)).rejects.toThrow(
      new BadRequestException([
        'Year must be a 4-digit number or omitted',
        'Page must be greater than 0',
        'Limit must be less than or equal to 50',
      ]),
    );
  });

  it('should handle default values for optional parameters', async () => {
    const mockQuery = {
      page: '1',
      limit: '10',
    };

    vi.spyOn(service, 'searchSongs').mockResolvedValue(mockResult);

    const result = await controller.searchSongs(
      mockQuery as unknown as SearchSongCriteriaDto,
    );

    expect(service.searchSongs).toHaveBeenCalledWith({
      ...mockQuery,
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
      controller.searchSongs(invalidQuery as unknown as SearchSongCriteriaDto),
    ).rejects.toThrow(
      new BadRequestException([
        'Invalid orderBy value. Use songName, albumName, year, totalPlays123',
      ]),
    );
  });

  it('should return data when no search criteria is provided', async () => {
    const mockQuery: SearchSongCriteriaDto = {}; // Empty criteria

    vi.spyOn(service, 'searchSongs').mockResolvedValue(mockResult);

    const result = await controller.searchSongs(mockQuery);

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
