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

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        { field: 'page', message: 'Page must be greater than 0' },
        { field: 'limit', message: 'Limit must be greater than 0' },
      ],
    });
  });

  it('should handle no songs found case', async () => {
    const response = await request(url)
      .get('/songs')
      .query({ year: 9999, page: 1, limit: 10 }) // Invalid year that shouldn't match any song
      .expect(HttpStatus.OK);

    expect(response.body.data).toEqual([]);
  });
});

describe('/songs/:id (GET)', () => {
  const url = inject('url');

  it('should return a song when found', async () => {
    const songId = 1;
    const query = { includePlayData: 'true' }; // Example query parameter

    // Mock response for the service
    const response = await request(url)
      .get(`/songs/${songId}`)
      .query(query)
      .expect(HttpStatus.OK);

    // Check that the response contains the expected song data and index
    expect(response.body).toHaveProperty('index');
    expect(response.body.index).toBe(1); // Ensure index is 1
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(songId);
  });

  it('should return an empty object if no song is found', async () => {
    const songId = 9999; // Invalid song ID
    const query = { includePlayData: 'true' };

    // Mock the service to return null
    const response = await request(url)
      .get(`/songs/${songId}`)
      .query(query)
      .expect(HttpStatus.NO_CONTENT);

    expect(response.body).toMatchObject({});
  });

  it('should return 400 for invalid query params', async () => {
    const songId = 1;
    const invalidQuery = { includePlayData: 'invalid' }; // Invalid query value

    const response = await request(url)
      .get(`/songs/${songId}`)
      .query(invalidQuery)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        {
          field: 'includePlayData',
          message: 'includePlayData must be "true" or "false"',
        },
      ],
    });
  });

  it('should handle invalid song id', async () => {
    const invalidSongId = 'abc'; // Invalid ID type (string instead of number)

    const response = await request(url)
      .get(`/songs/${invalidSongId}`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed (numeric string is expected)',
    });
  });
});

describe('/songs/recommendations (GET)', () => {
  const url = inject('url'); // Base URL for the app

  it('should return recommended songs with default criteria', async () => {
    const response = await request(url)
      .get('/songs/recommendations')
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((song) => {
      expect(song).toHaveProperty('index');
      expect(song).toHaveProperty('title');
      expect(song).toHaveProperty('year');
      expect(song).toHaveProperty('album');
      expect(song).toHaveProperty('totalPlays');
    });
  });

  it('should return recommended songs with valid query params', async () => {
    const response = await request(url)
      .get('/songs/recommendations')
      .query({ limit: 5, orderBy: 'songName', includePlayData: 'true' })
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((song) => {
      expect(song).toHaveProperty('index');
      expect(song).toHaveProperty('title');
      expect(song).toHaveProperty('year');
      expect(song).toHaveProperty('album');
      expect(song).toHaveProperty('totalPlays');
      expect(song).toHaveProperty('plays');
    });
  });

  it('should return 400 for invalid query params', async () => {
    const response = await request(url)
      .get('/songs/recommendations')
      .query({ limit: -5 }) // Invalid limit
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        expect.objectContaining({
          field: 'limit',
          message: expect.stringContaining('must be greater than'),
        }),
      ],
    });
  });

  it('should respect the "includePlayData" flag', async () => {
    const response = await request(url)
      .get('/songs/recommendations')
      .query({ includePlayData: 'false' })
      .expect(HttpStatus.OK);

    response.body.forEach((song) => {
      expect(song).not.toHaveProperty('playData'); // Ensure playData is excluded
    });
  });

  it('should respect sorting by a valid orderBy field', async () => {
    const response = await request(url)
      .get('/songs/recommendations')
      .query({ orderBy: 'totalPlays', orderDirection: 'desc' })
      .expect(HttpStatus.OK);

    const songs = response.body;
    for (let i = 1; i < songs.length; i++) {
      expect(songs[i - 1].totalPlays).toBeGreaterThanOrEqual(
        songs[i].totalPlays,
      );
    }
  });
});

describe('/top-songs-by-months (GET)', () => {
  const url = inject('url'); // Base URL for the app

  it('should return top songs for the current month with default criteria', async () => {
    const response = await request(url)
      .get('/songs/top-songs-by-months')
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('month');
      expect(item).toHaveProperty('year');
      expect(item).toHaveProperty('topSongs');
    });
  });

  it('should return top songs for specific months and years with valid query params', async () => {
    const response = await request(url)
      .get('/songs/top-songs-by-months')
      .query({ monthYears: '2024-01,2024-02', limit: 5 })
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('month');
      expect(item).toHaveProperty('year');
      expect(item).toHaveProperty('topSongs');
      expect(item.topSongs.length).toBeLessThanOrEqual(5); // Limit of 5
    });
  });

  it('should return 400 for invalid query params', async () => {
    const response = await request(url)
      .get('/songs/top-songs-by-months')
      .query({ monthYears: 'invalid-date-format', limit: -5 })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        expect.objectContaining({
          field: 'monthYears',
          message: expect.stringContaining('Invalid date format'),
        }),
        expect.objectContaining({
          field: 'limit',
          message: expect.stringContaining('must be greater than'),
        }),
      ],
    });
  });
});
