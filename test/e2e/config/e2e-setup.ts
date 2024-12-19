import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import type { GlobalSetupContext } from 'vitest/node';

let app: INestApplication;
const TEST_PORT = 5001;
const TEST_HOSTNAME = '0.0.0.0';

export async function setup({ provide }: GlobalSetupContext) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  await app.listen(TEST_PORT, TEST_HOSTNAME);
  const url = await app.getUrl();
  provide('url', url);

  return async () => {
    // teardown
    await app.close();
    console.log('Tear down');
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    accessTokenAdmin: string;
    accessTokenUser: string;
    url: string;
  }
}
