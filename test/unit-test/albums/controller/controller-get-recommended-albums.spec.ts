import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { AlbumsController } from '@src/albums/albums.controller';
import { AlbumsService } from '@src/albums/albums.service';
import { mockSearchAlbumDataWithSongs } from '../album-data';
import { SearchAlbumCriteriaSchema } from '@src/albums/dto/search-albums-by-criteria.dto';
import { MAX_LIMIT } from '@src/constants/PaginationConstants';

describe('AlbumsController - Get Recommended Albums', () => {
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
            getRecommendationAlbums: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should return a list of recommended album', async () => {
    const mockQuery = {
      limit: 10,
      orderBy: ['albumName'],
      includeSongData: true,
    };

    vi.spyOn(service, 'getRecommendationAlbums').mockResolvedValue(
      mockSearchAlbumDataWithSongs.data,
    );

    const result = await controller.getRecommendationAlbums(mockQuery);

    expect(service.getRecommendationAlbums).toHaveBeenCalledWith(mockQuery);
    expect(result).toEqual(mockSearchAlbumDataWithSongs.data);
  });

  it('should throw BadRequestException invalid criteria provided', async () => {
    const invalidQuery = {
      includeSongData: 'invalid',
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
            field: 'includeSongData',
            message: 'includeSongData must be \"true\" or \"false\"',
          },
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
