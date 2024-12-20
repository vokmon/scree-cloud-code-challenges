import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { AlbumsController } from '@src/albums/albums.controller';
import { AlbumsService } from '@src/albums/albums.service';
import { mockSearchAlbumDataWithoutSongs } from '../album-data';
import {
  SearchAlbumCriteriaDto,
  SearchAlbumCriteriaSchema,
} from '@src/albums/dto/search-albums-by-criteria.dto';
import { MAX_LIMIT, MIN_LIMIT } from '@src/constants/PaginationConstants';

describe('AlbumsController - Get Album by Id', () => {
  let controller: AlbumsController;
  let service: AlbumsService;
  const pipe = new ZodValidationPipe(SearchAlbumCriteriaSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [
        {
          provide: AlbumsService,
          useValue: {
            searchAlbums: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should call Albums.searchAlbums with valid criteria', async () => {
    const query: SearchAlbumCriteriaDto = {
      year: 2024,
      keyword: 'rock',
      includeSongData: true,
      page: 1,
      limit: 10,
      orderBy: ['albumName'],
      orderDirection: 'asc',
    };

    vi.spyOn(service, 'searchAlbums').mockResolvedValue(
      mockSearchAlbumDataWithoutSongs,
    );

    const result = await controller.searchAlbums(query);

    expect(service.searchAlbums).toHaveBeenCalled();
    expect(result).toEqual(mockSearchAlbumDataWithoutSongs);
  });

  it('should throw BadRequestException invalid criteria provided', async () => {
    const invalidQuery = {
      year: 'invalid-year',
      includeSongData: 'invalid',
      page: String(MIN_LIMIT - 1),
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
            field: 'year',
            message: 'Year must be a 4-digit number or omitted',
          },
          {
            field: 'includeSongData',
            message: 'includeSongData must be \"true\" or \"false\"',
          },
          { field: 'page', message: 'Page must be greater than 0' },
          {
            field: 'limit',
            message: 'Limit must be less than or equal to 100',
          },
          {
            field: 'orderBy',
            message: 'Invalid orderBy value. Use albumName',
          },
          {
            field: 'orderDirection',
            message: 'Invalid orderDirection value. Use \"asc\" or \"desc\"',
          },
        ],
      },
    });
  });
});
