import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import {
  getPaginationObject,
  getRecordIndex,
} from '@src/utils/pagination-utils';
import { SongsService } from '@src/songs/songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongResult,
} from '@src/songs/dto/search-songs.dto';
import { DatasourceService } from '@src/datasource/datasource.service';

describe('SongsService', () => {
  let service: SongsService;
  let datasourceServiceMock;

  const songsMock = [
    {
      id: 1,
      title: 'Love Song',
      year: 2023,
      totalPlays: 100,
      album: { title: 'Love Album' },
    },
    {
      id: 2,
      title: 'Another Love',
      year: 2023,
      totalPlays: 50,
      album: { title: 'Hits' },
    },
  ];

  const songsWithPlayDataMock = [
    {
      id: 1,
      title: 'Top Song',
      year: 2022,
      totalPlays: 200,
      album: { title: 'Top Album' },
      plays: [
        { month: 1, year: 2022, playCount: 50 },
        { month: 2, year: 2022, playCount: 150 },
      ],
    },
  ];

  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new SongsService(datasourceServiceMock);
  });

  it('should return songs filtered by year and keyword with pagination', async () => {
    // Given search criteria
    const page = 1;
    const limit = 2;
    const criteria: SearchSongCriteriaDto = {
      year: 2023,
      keyword: 'love',
      includePlayData: false,
      page,
      limit,
      orderBy: ['songName'],
      orderDirection: 'asc',
    };

    datasourceServiceMock.song.findMany.mockResolvedValue(songsMock);
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);

    // When search songs with the criteria
    const result = await service.searchSongs(criteria);

    // Then the Songs object can be transformed to dto correctly
    expectResult({ result, page, limit });

    // Asserts that the query is constructed correctly
    expect(datasourceServiceMock.song.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        title: true,
        year: true,
        totalPlays: true,
        album: { select: { title: true } },
      },
      where: {
        year: 2023,
        OR: [
          { title: { contains: 'love', mode: 'insensitive' } },
          {
            album: { is: { title: { contains: 'love', mode: 'insensitive' } } },
          },
        ],
      },
      orderBy: [{ title: 'asc' }],
      skip: 0,
      take: 2,
    });

    // Asserts that the count query is constructed correctly
    expect(datasourceServiceMock.song.count).toHaveBeenCalledWith({
      where: {
        year: 2023,
        OR: [
          { title: { contains: 'love', mode: 'insensitive' } },
          {
            album: { is: { title: { contains: 'love', mode: 'insensitive' } } },
          },
        ],
      },
    });
  });

  it('should include play data if includePlayData is true', async () => {
    // Given search criteria to include play data for this year
    const criteria: SearchSongCriteriaDto = {
      includePlayData: true,
      page: 1,
      limit: 1,
    };

    // Mock data returned from the database
    datasourceServiceMock.song.findMany.mockResolvedValue(
      songsWithPlayDataMock,
    );
    datasourceServiceMock.song.count.mockResolvedValue(
      songsWithPlayDataMock.length,
    );

    // When search the songs with criteria
    const result = await service.searchSongs(criteria);

    // Then, there should be plays object
    expect(result.data[0]).toHaveProperty('plays');

    // Validate the select statement that should have plays selected
    expect(datasourceServiceMock.song.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          plays: {
            select: { month: true, year: true, playCount: true },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
          },
        }),
      }),
    );
  });

  it('should return empty results if no songs match', async () => {
    const criteria: SearchSongCriteriaDto = { page: 1, limit: 10 };

    // No data return
    datasourceServiceMock.song.findMany.mockResolvedValue([]);
    datasourceServiceMock.song.count.mockResolvedValue(0);

    // When search for the songs
    const result = await service.searchSongs(criteria);

    // there should be no data in the list
    expect(result).toEqual({
      data: [],
      pagination: getPaginationObject({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      }),
    });
  });

  it('should return all songs when no search criteria are provided', async () => {
    const page = 1;
    const limit = 5;
    // Given No search criteria provided
    const criteria: SearchSongCriteriaDto = { page, limit };

    // Mock return result from the database
    datasourceServiceMock.song.findMany.mockResolvedValue(songsMock);
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);

    // When search the songs by criteria
    const result = await service.searchSongs(criteria);

    expectResult({ result, page, limit });

    // Validate the query statement
    expect(datasourceServiceMock.song.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        title: true,
        year: true,
        totalPlays: true,
        album: { select: { title: true } },
      },
      where: {}, // Empty where clause
      orderBy: [], // No order applied
      skip: 0,
      take: limit,
    });
    expect(datasourceServiceMock.song.count).toHaveBeenCalledWith({
      where: {}, // Empty where clause
    });
  });

  it('should return songs sorted by albumName', async () => {
    const page = 1;
    const limit = 5;
    const criteria: SearchSongCriteriaDto = {
      page,
      limit,
      orderBy: ['albumName'],
    };

    datasourceServiceMock.song.findMany.mockResolvedValue(songsMock);
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);

    const result = await service.searchSongs(criteria);

    expectResult({ result, page, limit });
  });

  it('should return songs sorted by year', async () => {
    const page = 1;
    const limit = 5;
    const criteria: SearchSongCriteriaDto = {
      page,
      limit,
      orderBy: ['year'],
      orderDirection: 'asc',
    };

    datasourceServiceMock.song.findMany.mockResolvedValue(songsMock);
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);

    const result = await service.searchSongs(criteria);

    expectResult({ result, page, limit });
  });

  it('should return songs sorted by totalPlays', async () => {
    const page = 1;
    const limit = 5;
    const criteria: SearchSongCriteriaDto = {
      page,
      limit,
      orderBy: ['totalPlays'],
      orderDirection: 'asc',
    };

    datasourceServiceMock.song.findMany.mockResolvedValue(songsMock);
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);

    const result = await service.searchSongs(criteria);

    expectResult({ result, page, limit });
  });

  const expectResult = ({
    result,
    page,
    limit,
  }: {
    result: SearchSongResult;
    page: number;
    limit: number;
  }) => {
    // Then the Songs object can be transformed to dto correctly
    const expectedSongsDto = songsMock.map((song, index) => ({
      index: getRecordIndex({ index, skip: 0 }),
      title: song.title,
      year: song.year,
      totalPlays: song.totalPlays,
      album: song.album,
    }));

    // The result should returned as expected
    expect(result).toEqual({
      data: expectedSongsDto,
      pagination: getPaginationObject({
        data: expectedSongsDto,
        total: songsMock.length,
        page,
        limit,
      }),
    });
  };
});
