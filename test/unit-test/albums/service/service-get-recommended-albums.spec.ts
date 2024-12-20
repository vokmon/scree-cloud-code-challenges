import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { DatasourceService } from '@src/datasource/datasource.service';
import { SongMapperService } from '@src/mappers/song-mapper.dto';
import { AlbumsService } from '@src/albums/albums.service';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';
import { mockSearchAlbumDataWithSongs } from '../album-data';
import { GetRecommendationAlbumsCriteriaDto } from '@src/albums/dto/get-albums-recommendations.dto';

describe('AlbumsService - getRecommendationAlbums', () => {
  let service: AlbumsService;
  let datasourceServiceMock;
  const albumMapperService = new AlbumMapperService(new SongMapperService());
  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new AlbumsService(datasourceServiceMock, albumMapperService);
  });

  it('should fetch recommended albums based on criteria', async () => {
    const limit = 2;
    const albums = mockSearchAlbumDataWithSongs.data.slice(0, limit);
    const query: GetRecommendationAlbumsCriteriaDto = {
      limit,
      orderBy: ['albumName'],
      includeSongData: true,
    };
    datasourceServiceMock.album.count.mockResolvedValue(albums.length);
    datasourceServiceMock.album.findMany.mockResolvedValue(albums);

    const result = await service.getRecommendationAlbums(query);

    expect(result).toHaveLength(limit);
    const expectedSongs = albums.map((album, index) => ({
      index: index + 1,
      ...album,
    }));
    expect(result).toEqual(expect.arrayContaining(expectedSongs));
  });
});
