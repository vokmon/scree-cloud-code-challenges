import { HttpStatus } from '@nestjs/common';
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
