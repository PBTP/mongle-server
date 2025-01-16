import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFutures = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFutures.createNestApplication();
    appController = app.get<AppController>(AppController);
    await app.init();
  });

  test('integration test ', async () => {
    await request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .expect('Hello World!');
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
