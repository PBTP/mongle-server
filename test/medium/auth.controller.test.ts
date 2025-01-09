import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../../src/auth/auth.module';
import { ImageModule } from '../../src/common/image/image.module';
import { CloudModule } from '../../src/common/cloud/cloud.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

describe('AuthController E2E 테스트 (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        ImageModule,
        CloudModule,
        RedisModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            return {
              config: {},
              readyLog: true,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            const datasource = {
              host: 'localhost',
              port: 5432,
              username: 'test',
              password: 'test',
              database: 'test',
              logging: false,
            };

            return {
              type: 'postgres',
              host: datasource.host,
              port: datasource.port,
              username: datasource.username,
              password: datasource.password,
              database: datasource.database,
              logging: datasource.logging,
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: false,
              namingStrategy: new SnakeNamingStrategy(),
            };
          },
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
