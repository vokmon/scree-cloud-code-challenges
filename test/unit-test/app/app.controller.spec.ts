import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    console.log(process.env.TEST_ENV);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "The server is running."', () => {
      expect(appController.getServerStatus()).toBe('The server is running.');
    });
  });
});
