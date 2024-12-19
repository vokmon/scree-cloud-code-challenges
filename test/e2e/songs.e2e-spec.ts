import { HttpStatus } from '@nestjs/common';
import { SearchSongResult } from '@src/songs/dto/search-songs.dto';
import request from 'supertest';
import { inject } from 'vitest';

describe('/songs (GET)', () => {
  const url = inject('url');

  it('should return all songs with correct pagination', async () => {
    const response = await request(url)
      .get('/songs')
      .query({ page: 1, limit: 10 }) // Sample query params for pagination
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.pagination).toHaveProperty('page');
    expect(response.body.pagination).toHaveProperty('limit');
  });

  it('should return songs filtered by year', async () => {
    const year = 2009;
    const response = await request(url)
      .get('/songs')
      .query({ year: year, page: 1, limit: 10 })
      .expect(200);

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          year: year,
        }),
      ]),
    );
  });

  it('should return songs filtered by keyword', async () => {
    const keyword = 'love';
    const response = await request(url)
      .get('/songs')
      .query({ keyword: keyword, page: 1, limit: 10 })
      .expect(HttpStatus.OK);

    const result = response.body as SearchSongResult;
    result.data.forEach((song) => {
      expect(
        song.title.match(new RegExp(keyword, 'i')) ||
          song.album?.title.match(new RegExp(keyword, 'i')),
      ).toBeTruthy();
    });
  });

  it('should return 400 for invalid query params', async () => {
    const response = await request(url)
      .get('/songs')
      .query({ page: -1, limit: 0 }) // Invalid pagination
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toContain('Page must be greater than 0');
    expect(response.body.message).toContain('Limit must be greater than 0');
  });

  it('should handle no songs found case', async () => {
    const response = await request(url)
      .get('/songs')
      .query({ year: 9999, page: 1, limit: 10 }) // Invalid year that shouldn't match any song
      .expect(HttpStatus.OK);

    expect(response.body.data).toEqual([]);
  });
});
