import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { SongsService } from '@src/songs/songs.service';
import { DatasourceService } from '@src/datasource/datasource.service';
import { GetRecommendationCriteriaDto } from '@src/songs/dto/get-recommendations.dto';

describe('SongsService - getRecommendationSongs', () => {
  let service: SongsService;
  let datasourceServiceMock;

  const songsMock = [
    {
      title: 'Song 1',
      year: 2023,
      totalPlays: 100,
      album: { title: 'Love Album' },
    },
    {
      title: 'Song 2',
      year: 2023,
      totalPlays: 50,
      album: { title: 'Fearless' },
    },
    {
      title: 'Song 3',
      year: 2023,
      totalPlays: 50,
      album: { title: 'Taylor Swift' },
    },
    {
      title: 'Song 4',
      year: 2023,
      totalPlays: 50,
      album: { title: 'Hits' },
    },
  ];

  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new SongsService(datasourceServiceMock);
  });

  it('should fetch random songs based on criteria', async () => {
    const limit = 2;
    const songs = songsMock.slice(0, limit);
    const query: GetRecommendationCriteriaDto = {
      limit,
      orderBy: ['songName'],
      includePlayData: false,
    };
    datasourceServiceMock.song.count.mockResolvedValue(songsMock.length);
    datasourceServiceMock.song.findMany.mockResolvedValue(songs);

    const result = await service.getRecommendationSongs(query);

    expect(result).toHaveLength(2);
    const expectedSongs = songs.map((song, index) => ({
      index: index + 1,
      ...song,
    }));
    expect(result).toEqual(expect.arrayContaining(expectedSongs));
  });
});
