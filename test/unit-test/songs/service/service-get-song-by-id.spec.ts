import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { SongsService } from '@src/songs/songs.service';
import { DatasourceService } from '@src/datasource/datasource.service';
import { GetSongByIdCriteriaDto } from '@src/songs/dto/get-songs-by-id.dto';
import { SongMapperService } from '@src/mappers/song-mapper.dto';

describe('SongsService - getSongById', () => {
  let service: SongsService;
  let datasourceServiceMock;

  beforeEach(() => {
    datasourceServiceMock = mockDeep<DatasourceService>();
    service = new SongsService(datasourceServiceMock, new SongMapperService());
  });

  it('should return a song if found', async () => {
    const songId = 1;
    const criteria: GetSongByIdCriteriaDto = { includePlayData: true }; // Example criteria
    const mockSong = { id: songId, title: 'Song Title', artist: 'Artist Name' };

    // Mock the datasourceService's findUnique method
    datasourceServiceMock.song.findUnique.mockResolvedValue(mockSong);

    const result = await service.getSongById(songId, criteria);

    // Expects the song to have the `index` added
    expect(result).toEqual({ index: 1, ...mockSong });
    expect(datasourceServiceMock.song.findUnique).toHaveBeenCalledWith({
      select: expect.any(Object), // Adjust based on selectFields logic
      where: { id: songId },
    });
  });

  it('should return null if no song is found', async () => {
    const songId = 1;
    const criteria: GetSongByIdCriteriaDto = { includePlayData: true }; // Example criteria

    // Mock datasourceService's findUnique method to return null
    datasourceServiceMock.song.findUnique.mockResolvedValue(null);

    const result = await service.getSongById(songId, criteria);

    // Expects null if no song is found
    expect(result).toBeNull();
    expect(datasourceServiceMock.song.findUnique).toHaveBeenCalledWith({
      select: expect.any(Object), // Adjust based on selectFields logic
      where: { id: songId },
    });
  });
});
