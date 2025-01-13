import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthController } from '../../src/auth/presentation/auth.controller';
import { AuthService } from '../../src/auth/application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SmsModule } from '../../src/common/sender/sms/sms.module';
import { UserModule } from '../../src/auth/user.module';
import { CacheModule } from '../../src/common/cache/cache.module';
import { DriverModule } from '../../src/driver/driver.module';
import { SecurityModule } from '../../src/auth/application/security.module';
import { BusinessModule } from '../../src/business/business.module';
import { CustomerModule } from '../../src/customer/customer.module';
import { ImageModule } from '../../src/common/image/image.module';
import { CLOUD_STORAGE } from '../../src/common/cloud/aws/s3/application/s3.service';
import { FakeCloudStorageService } from '../mock/fake.cloud-storage.service';
import { CloudModule } from '../../src/common/cloud/cloud.module';
import { DataSource } from 'typeorm';
import { FakeConfigService } from '../mock/fake.config.service';
import { HttpStatusCode } from 'axios';
import { PgTestHelper } from '../mock/pg.test-helper';
import { RedisTestHelper } from '../mock/redis.test-helper';

describe('AuthController E2E 테스트', () => {
  let app: INestApplication;

  let redisTestHelper: RedisTestHelper;
  let pgTestHelper: PgTestHelper;

  beforeEach(async () => {
    // Redis Testcontainers 설정
    redisTestHelper = new RedisTestHelper();
    await redisTestHelper.start();

    pgTestHelper = new PgTestHelper();

    // pg-mem 설정
    const { db, dataSource } = await pgTestHelper.connect();

    const moduleFutures = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: async () => ({ secret: 'test-secret' }),
        }),
        PassportModule.register({ defaultStrategy: 'access' }),
        await pgTestHelper.module(),
        await redisTestHelper.module(),
        SmsModule,
        UserModule,
        CacheModule,
        DriverModule,
        SecurityModule,
        BusinessModule,
        CustomerModule,
        ImageModule,
        CloudModule,
      ],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(ConfigService)
      .useClass(FakeConfigService)
      .overrideProvider(CLOUD_STORAGE)
      .useClass(FakeCloudStorageService)
      .overrideProvider(DataSource) // 데이터베이스 프로바이더 오버라이드
      .useValue(dataSource) // pg-mem 데이터 소스 주입
      .compile();

    app = moduleFutures.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    pgTestHelper.restore();
  });

  afterAll(async () => {
    await redisTestHelper.stop();
    await pgTestHelper.disconnect();
    await app.close();
  });

  test('빈값으로 보내면 Bad Request가 반환된다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .expect(HttpStatusCode.BadRequest);

    const body = response.body;
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
  });
});
