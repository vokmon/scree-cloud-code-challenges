import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { inject } from 'vitest';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(inject('url'))
      .get('/')
      .expect(HttpStatus.OK)
      .expect('The server is running.');
  });
});
