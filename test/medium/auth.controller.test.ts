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
import { FakeConfigService } from '../mock/fake.config.service';
import { HttpStatusCode } from 'axios';
import { PostGisHelper } from '../mock/pg.test-helper';
import { RedisTestHelper } from '../mock/redis.test-helper';
import { UUID_HOLDER } from '../../src/common/holder/uuid.holders';
import { FakeUuidHolder } from '../mock/fake.holder';

describe('AuthController E2E 테스트', () => {
  let app: INestApplication;

  let redisTestHelper: RedisTestHelper;
  let pgTestHelper: PostGisHelper;
  const uuidHolder = new FakeUuidHolder();

  beforeAll(async () => {
    // Redis Testcontainers 설정
    redisTestHelper = new RedisTestHelper();
    await redisTestHelper.start();

    // PostGis Testcontainers 설정
    pgTestHelper = new PostGisHelper();
    await pgTestHelper.start();

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
      .overrideProvider(UUID_HOLDER)
      .useValue(uuidHolder)
      .overrideProvider(ConfigService)
      .useClass(FakeConfigService)
      .overrideProvider(CLOUD_STORAGE)
      .useClass(FakeCloudStorageService)
      .compile();

    app = moduleFutures.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    await redisTestHelper.stop();
    await pgTestHelper.stop();
    await app.close();
  });

  test('빈값으로 보내면 Bad Request가 반환된다.', async () => {
    // Given
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .expect(HttpStatusCode.BadRequest);

    // Then
    const body = response.body;
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
    console.table(body);
  });

  test('userType이 없으면 Bad Request가 반환된다.', async () => {
    // Given
    const user = {
      phoneNumber: '01012345678',
      password: 'password',
    };

    // When
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(user)
      .expect(HttpStatusCode.BadRequest);

    // Then
    const body = response.body;
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
    console.table(body);
  });

  test('name이 없으면 Bad Request가 반환된다.', async () => {
    // Given
    const user = {
      userType: 'customer',
      phoneNumber: '01012345678',
    };

    // When
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(user)
      .expect(HttpStatusCode.BadRequest);

    // Then
    const body = response.body;
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
    console.table(body);
  });

  test('phoneNumber이 없으면 Bad Request가 반환된다.', async () => {
    // Given
    const user = {
      userType: 'customer',
      name: 'test',
    };

    // When
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(user)
      .expect(HttpStatusCode.BadRequest);

    // Then
    const body = response.body;
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
    console.table(body);
  });

  test('정상적인 요청이면 Created가 반환된다.', async () => {
    // Given
    const user = {
      authProvider: 'KAKAO',
      userType: 'customer',
      uuid: 'test',
      name: 'test',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(user)
      .expect(HttpStatusCode.Created);

    const body = response.body;
    const data = body.data;

    // then
    expect(data).toBeDefined();
    expect(data.uuid).toBe(user.uuid);
    expect(data.name).toBe(user.name);
    expect(data.userId).toBeDefined();
    expect(data.userType).toBe(user.userType);
    expect(data.authProvider).toBe(user.authProvider);
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
    console.table(data);
  });
});
