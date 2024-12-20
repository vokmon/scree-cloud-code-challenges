import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { DatasourceService } from '@src/datasource/datasource.service';
import { SongMapperService } from '@src/mappers/song-mapper.dto';
import { AlbumsService } from '@src/albums/albums.service';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';
import {
  mockSearchAlbumDataWithoutSongs,
  mockSearchAlbumDataWithSongs,
} from '../album-data';
import { SearchAlbumCriteriaDto } from '@src/albums/dto/search-albums-by-criteria.dto';

describe('AlbumsService - searchAlbums', () => {
  let service: AlbumsService;
  let datasourceServiceMock;
  const albumMapperService = new AlbumMapperService(new SongMapperService());
  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new AlbumsService(datasourceServiceMock, albumMapperService);
  });

  const whereConditions = {
    songs: { some: { year: 2024 } },
    OR: [
      { title: { contains: 'rock', mode: 'insensitive' } },
      {
        songs: { some: { title: { contains: 'rock', mode: 'insensitive' } } },
      },
      {
        songs: {
          some: {
            writers: {
              some: {
                writer: {
                  is: { name: { contains: 'rock', mode: 'insensitive' } },
                },
              },
            },
          },
        },
      },
      {
        songs: {
          some: {
            artists: {
              some: {
                artist: {
                  is: { name: { contains: 'rock', mode: 'insensitive' } },
                },
              },
            },
          },
        },
      },
    ],
  };

  it('should return albums with pagination with only mandatory fields', async () => {
    // Mock input
    const query = {
      page: 1,
      limit: 10,
    };

    // Mock implementations
    datasourceServiceMock.album.findMany.mockResolvedValue(
      mockSearchAlbumDataWithoutSongs.data,
    );
    datasourceServiceMock.album.count.mockResolvedValue(
      mockSearchAlbumDataWithoutSongs.pagination.total,
    );

    // Call the service
    const result = await service.searchAlbums(query);

    // Assertions
    expect(datasourceServiceMock.album.findMany).toHaveBeenCalledWith({
      select: { id: true, title: true },
      where: {},
      orderBy: [],
      skip: 0,
      take: 10,
    });
    expect(datasourceServiceMock.album.count).toHaveBeenCalledWith({
      where: {},
    });

    expect(result).toEqual(mockSearchAlbumDataWithoutSongs);
  });

  it('should return albums with pagination', async () => {
    // Mock input
    const query = {
      year: 2024,
      keyword: 'rock',
      page: 1,
      limit: 10,
    };

    // Mock implementations
    datasourceServiceMock.album.findMany.mockResolvedValue(
      mockSearchAlbumDataWithoutSongs.data,
    );
    datasourceServiceMock.album.count.mockResolvedValue(
      mockSearchAlbumDataWithoutSongs.pagination.total,
    );

    // Call the service
    const result = await service.searchAlbums(query);

    // Assertions
    expect(datasourceServiceMock.album.findMany).toHaveBeenCalledWith({
      select: { id: true, title: true },
      where: whereConditions,
      orderBy: [],
      skip: 0,
      take: 10,
    });
    expect(datasourceServiceMock.album.count).toHaveBeenCalledWith({
      where: whereConditions,
    });

    expect(result).toEqual(mockSearchAlbumDataWithoutSongs);
  });

  it('should return albums with songs data pagination', async () => {
    // Mock input
    const query: SearchAlbumCriteriaDto = {
      year: 2024,
      keyword: 'rock',
      includeSongData: true,
      page: 1,
      limit: 10,
      orderBy: ['albumName'],
      orderDirection: 'asc',
    };

    // Mock implementations
    datasourceServiceMock.album.findMany.mockResolvedValue(
      mockSearchAlbumDataWithSongs.data,
    );
    datasourceServiceMock.album.count.mockResolvedValue(
      mockSearchAlbumDataWithSongs.pagination.total,
    );

    // Call the service
    const result = await service.searchAlbums(query);

    // Assertions
    expect(datasourceServiceMock.album.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        title: true,
        songs: {
          select: {
            id: true,
            title: true,
            totalPlays: true,
            year: true,
            writers: { select: { writer: { select: { name: true } } } },
            artists: { select: { artist: { select: { name: true } } } },
          },
        },
      },
      where: whereConditions,
      orderBy: [
        {
          title: query.orderDirection,
        },
      ],
      skip: 0,
      take: 10,
    });
    expect(datasourceServiceMock.album.count).toHaveBeenCalledWith({
      where: whereConditions,
    });

    expect(result).toEqual(mockSearchAlbumDataWithSongs);
  });
});
