import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { AlbumsController } from '@src/albums/albums.controller';
import { AlbumsService } from '@src/albums/albums.service';
import {
  GetAlbumByIdCriteriaDto,
  GetAlbumByIdCriteriaSchema,
} from '@src/albums/dto/get-albums-by-id.dto';
import { mockAlbumWithoutSongs } from '../album-data';

describe('AlbumsController - Get Album by Id', () => {
  let controller: AlbumsController;
  let service: AlbumsService;
  const pipe = new ZodValidationPipe(GetAlbumByIdCriteriaSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [
        {
          provide: AlbumsService,
          useValue: {
            getAlbumById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should return album by Id when valid Id and query are provided', async () => {
    const albumId = 1;
    const query: GetAlbumByIdCriteriaDto = { includeSongData: false };

    vi.spyOn(service, 'getAlbumById').mockResolvedValue(mockAlbumWithoutSongs);

    const result = await controller.getAlbumById(albumId, query);

    expect(result).toEqual(mockAlbumWithoutSongs);
    expect(service.getAlbumById).toHaveBeenCalledWith(albumId, query);
  });

  it('should return null when invalid Id is provided', async () => {
    const albumId = 999;
    const query: GetAlbumByIdCriteriaDto = { includeSongData: false };

    vi.spyOn(service, 'getAlbumById').mockResolvedValue(null);

    await expect(controller.getAlbumById(albumId, query)).rejects.toMatchObject(
      {},
    );
    expect(service.getAlbumById).toHaveBeenCalledWith(albumId, query);
  });

  it('should throw BadRequestException if query is invalid', async () => {
    const invalidQuery = {
      includeSongData: 'invalid',
    }; // Invalid query to trigger validation error

    await expect(
      pipe.transform(invalidQuery, { type: 'param' }),
    ).rejects.toMatchObject({
      response: {
        message: 'Validation failed',
        errors: [
          {
            field: 'includeSongData',
            message: 'includeSongData must be "true" or "false"',
          },
        ],
      },
    });
  });
});
