import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { DatasourceService } from '@src/datasource/datasource.service';
import { SongMapperService } from '@src/mappers/song-mapper.dto';
import { AlbumsService } from '@src/albums/albums.service';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';
import { GetAlbumByIdCriteriaDto } from '@src/albums/dto/get-albums-by-id.dto';
import { mockAlbumWithoutSongs, mockAlbumWithSongs } from '../album-data';

describe('AlbumsService - getAlbumById', () => {
  let service: AlbumsService;
  let datasourceServiceMock;
  const albumMapperService = new AlbumMapperService(new SongMapperService());
  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new AlbumsService(datasourceServiceMock, albumMapperService);
  });

  it('should return data when album is found', async () => {
    const albumId = 1;
    const query: GetAlbumByIdCriteriaDto = {};

    datasourceServiceMock.album.findUnique.mockResolvedValue(
      mockAlbumWithoutSongs,
    );

    const result = await service.getAlbumById(albumId, query);

    expect(datasourceServiceMock.album.findUnique).toHaveBeenCalledWith({
      where: { id: albumId },
      select: {
        id: true,
        title: true,
      },
    });
    expect(result).toEqual(mockAlbumWithoutSongs);
  });

  it('should return data with song data when album is found', async () => {
    const albumId = 1;
    const query: GetAlbumByIdCriteriaDto = { includeSongData: true };

    datasourceServiceMock.album.findUnique.mockResolvedValue(
      mockAlbumWithSongs,
    );

    const result = await service.getAlbumById(albumId, query);

    expect(datasourceServiceMock.album.findUnique).toHaveBeenCalledWith({
      where: { id: albumId },
      select: {
        id: true,
        title: true,
        songs: {
          select: {
            id: true,
            title: true,
            totalPlays: true,
            year: true,
            writers: {
              select: {
                writer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            artists: {
              select: {
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(mockAlbumWithSongs);
  });

  it('should return null when album is not found', async () => {
    const albumId = 1;
    const query: GetAlbumByIdCriteriaDto = {};

    datasourceServiceMock.album.findUnique.mockResolvedValue(null);

    const result = await service.getAlbumById(albumId, query);

    expect(datasourceServiceMock.album.findUnique).toHaveBeenCalledWith({
      where: { id: albumId },
      select: {
        id: true,
        title: true,
      },
    });
    expect(result).toEqual(null);
  });
});
