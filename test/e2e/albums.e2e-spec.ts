import { HttpStatus } from '@nestjs/common';
import { SearchAlbumResult } from '@src/albums/dto/search-albums-by-criteria.dto';
import { MAX_LIMIT, MIN_LIMIT } from '@src/constants/PaginationConstants';
import request from 'supertest';
import { inject } from 'vitest';

describe('/albums/:id (GET)', () => {
  const url = inject('url');

  it('should return an album when found', async () => {
    const albumId = 1;
    const query = { includeSongData: 'false' };

    // Mock response for the service
    const response = await request(url)
      .get(`/albums/${albumId}`)
      .query(query)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(albumId);
  });

  it('should return an album with songs when found', async () => {
    const albumId = 1;
    const query = { includeSongData: 'true' };

    // Mock response for the service
    const response = await request(url)
      .get(`/albums/${albumId}`)
      .query(query)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(albumId);
    expect(response.body.songs).toBeDefined();
  });

  it('should nothing invalid id is provide', async () => {
    const albumId = 9999;
    const query = { includeSongData: 'false' };

    // Mock response for the service
    const response = await request(url)
      .get(`/albums/${albumId}`)
      .query(query)
      .expect(HttpStatus.NO_CONTENT);
    expect(response.body).toMatchObject({});
  });

  it('should return an error when criteria is invalid', async () => {
    const albumId = 1;
    const query = { includeSongData: 'invalid' };

    // Mock response for the service
    const response = await request(url)
      .get(`/albums/${albumId}`)
      .query(query)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        {
          field: 'includeSongData',
          message: 'includeSongData must be "true" or "false"',
        },
      ],
    });
  });
});

describe('/albums/ (GET)', () => {
  const url = inject('url');
  it('should return a list of albums with pagination', async () => {
    const query = {
      year: '2009',
      keyword: 'taylor',
      page: 1,
      limit: 10,
      includeSongData: true,
      orderBy: 'albumName',
      orderDirection: 'asc',
    };

    const response = await request(url)
      .get('/albums')
      .query(query)
      .expect(HttpStatus.OK);
    const result: SearchAlbumResult = response.body;
    expect(result).toHaveProperty('data');
    expect(result.data.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('pagination');
  });

  it('should return error if the criteria is invalid', async () => {
    const query = {
      year: 'invalid-year',
      includeSongData: 'invalid',
      page: String(MIN_LIMIT - 1),
      limit: String(MAX_LIMIT + 1),
      orderBy: 'invalid',
      orderDirection: 'invalid',
    };

    const response = await request(url)
      .get('/albums')
      .query(query)
      .expect(HttpStatus.BAD_REQUEST); // Expecting a 400 Bad Request due to invalid year format

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        {
          field: 'year',
          message: 'Year must be a 4-digit number or omitted',
        },
        {
          field: 'includeSongData',
          message: 'includeSongData must be "true" or "false"',
        },
        { field: 'page', message: 'Page must be greater than 0' },
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
          message: 'Invalid orderDirection value. Use "asc" or "desc"',
        },
      ],
    });
  });
});

describe('/albums/recommendations (GET)', () => {
  const url = inject('url'); // Base URL for the app

  it('should return recommended albums with default criteria', async () => {
    const response = await request(url)
      .get('/albums/recommendations')
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return recommended albums with valid query params', async () => {
    const limit = 5;
    const response = await request(url)
      .get('/albums/recommendations')
      .query({ limit, orderBy: 'albumName', includeSongData: 'true' })
      .expect(HttpStatus.OK);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(limit);
  });

  it('should return 400 for invalid query params', async () => {
    const response = await request(url)
      .get('/albums/recommendations')
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

  it('should respect the "includeSongData" flag: false', async () => {
    const response = await request(url)
      .get('/albums/recommendations')
      .query({ includeSongData: 'false' })
      .expect(HttpStatus.OK);

    response.body.forEach((album) => {
      expect(album).not.toHaveProperty('songs');
    });
  });

  it('should respect the "includeSongData" flag: true', async () => {
    const response = await request(url)
      .get('/albums/recommendations')
      .query({ includeSongData: 'true' })
      .expect(HttpStatus.OK);

    response.body.forEach((album) => {
      expect(album).toHaveProperty('songs');
    });
  });
});
