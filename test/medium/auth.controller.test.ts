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
import { FakeDateHolder, FakeUuidHolder } from '../mock/fake.holder';
import { DataSource } from 'typeorm';
import { CustomerSeeder } from '../mock/seeders';
import { AuthProvider } from '../../src/auth/presentation/user.dto';
import { CustomerService } from '../../src/customer/application/customer.service';
import { JwtRefreshStrategy } from '../../src/auth/application/jwt-refresh.strategy';
import { AuthDto } from '../../src/auth/presentation/auth.dto';
import { SMS_SERVICE } from '../../src/common/sender/sms/application/sms.service';
import { FakeSmsService } from '../mock/fake.sms.service';
import { JwtAccessStrategy } from '../../src/auth/application/jwt-access.strategy';

describe('AuthController E2E 테스트', () => {
  let app: INestApplication;
  let redisTestHelper: RedisTestHelper;
  let pgTestHelper: PostGisHelper;

  let customerService: CustomerService;

  const uuidHolder = new FakeUuidHolder();
  const date = new Date('2021-01-01T00:00:00Z');
  const dateHolder = new FakeDateHolder(date);

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
      providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
    })
      .overrideProvider(UUID_HOLDER)
      .useValue(uuidHolder)
      .overrideProvider(SMS_SERVICE)
      .useClass(FakeSmsService)
      .overrideProvider(ConfigService)
      .useClass(FakeConfigService)
      .overrideProvider(CLOUD_STORAGE)
      .useClass(FakeCloudStorageService)
      .compile();

    app = moduleFutures.createNestApplication();
    await app.init();

    const dataSource = app.get(DataSource);
    customerService = app.get(CustomerService);

    await pgTestHelper.seed(new CustomerSeeder(dateHolder), dataSource);
  }, 30000);

  afterAll(async () => {
    await redisTestHelper.stop();
    await pgTestHelper.stop();
    await app.close();
  });

  describe('POST /v1/auth/login', () => {
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

    test('authProvider가 없으면 Bad Request가 반환된다.', async () => {
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

    test('이미 가입된 사용자라면 entity를 생성하지 않는다.', async () => {
      // Given
      const seedCustomer = {
        uuid: 'customer-seed-uuid',
        userType: 'customer',
        authProvider: AuthProvider.KAKAO,
        customerId: 1,
      };

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(seedCustomer)
        .expect(HttpStatusCode.Created);

      // Then

      const body = response.body;
      const data = body.data;
      expect(data).toBeDefined();
      expect(data.uuid).toBe(seedCustomer.uuid);
      expect(data.userId).toEqual(1);
      expect(data.userType).toBe(seedCustomer.userType);
      expect(data.authProvider).toBe(seedCustomer.authProvider);
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();

      console.log('data');
      console.table(data);

      await customerService
        .findOne({ uuid: seedCustomer.uuid })
        .then((customer) => {
          expect(customer).toBeDefined();
          expect(customer?.userId).toEqual(1);
          expect(customer?.customerId).toEqual(1);
          expect(customer?.uuid).toEqual(seedCustomer.uuid);
          expect(customer?.authProvider).toEqual(seedCustomer.authProvider);
          expect(customer?.name).toEqual('customer-seed-name');
          expect(customer?.phoneNumber).toEqual('customer-seed-phone');
          console.log('customer');
          console.table(customer);
        });
    });
  });

  describe('POST /v1/auth/refresh', () => {
    let user: AuthDto;

    beforeAll(async () => {
      const loginUser = {
        authProvider: 'KAKAO',
        userType: 'customer',
        uuid: 'customer-seed-uuid',
        name: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginUser)
        .expect(HttpStatusCode.Created);

      const body = response.body;
      const data = body.data;

      expect(data).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      user = data;

      console.table(data);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('Authorization 헤더를 빈값으로 보내면 Unauthorized 가 반환된다.', async () => {
      // Given
      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/refresh')
        .expect(HttpStatusCode.Unauthorized);

      // Then
      const body = response.body;
      expect(body.message).toEqual('Unauthorized');
      expect(body.statusCode).toEqual(HttpStatusCode.Unauthorized);
      console.table(body);
    });

    test('refreshToken이 Bearer 토큰이 아니면 Unauthorized가 반환된다', async () => {
      // Given
      const authorization = 'test';

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/refresh')
        .set('Authorization', authorization)
        .expect(HttpStatusCode.Unauthorized);

      // Then
      const body = response.body;
      expect(body.message).toEqual('Unauthorized');
      expect(body.statusCode).toEqual(HttpStatusCode.Unauthorized);
      console.table(body);
    });

    test('refreshToken이 만료되면 Unauthorized가 반환된다.', async () => {
      // Given
      jest.useFakeTimers({
        now: new Date().getTime() + 1000 * 60 * 60 * 24 * 31, // 31일 후
      });
      console.log('now', new Date());
      console.log('accessToken', user.accessToken);
      console.log('refreshToken', user.refreshToken);

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/refresh')
        .set('Authorization', `Bearer ${user.refreshToken}`)
        .expect(HttpStatusCode.Unauthorized);

      // Then
      const body = response.body;
      expect(body.message).toEqual('Unauthorized');
      expect(body.statusCode).toEqual(HttpStatusCode.Unauthorized);
      console.table(body);
      jest.clearAllTimers();
    });

    test('refreshToken이 정상적이면 accessToken과 refreshToken 모두 갱신한다.', async () => {
      // Given
      console.log('now', new Date());
      console.log('accessToken', user.accessToken);
      console.log('refreshToken', user.refreshToken);

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/refresh')
        .set('Authorization', `Bearer ${user.refreshToken}`)
        .expect(HttpStatusCode.Created);

      // Then
      const body = response.body;
      const data = body.data;

      expect(data).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      expect(data.accessToken).not.toEqual(user.accessToken);
      expect(data.refreshToken).not.toEqual(user.refreshToken);
      expect(data.userId).toEqual(user.userId);
      expect(data.uuid).toEqual(user.uuid);
      expect(data.userType).toEqual(user.userType);
      expect(data.authProvider).toEqual(user.authProvider);
      console.log('data');
      console.table(data);
    });
  });

  describe('POST /v1/auth/otp', () => {
    let user: AuthDto;

    beforeAll(async () => {
      const loginUser = {
        authProvider: 'KAKAO',
        userType: 'customer',
        uuid: 'customer-seed-uuid',
        name: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginUser)
        .expect(HttpStatusCode.Created);

      const body = response.body;
      const data = body.data;

      expect(data).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
      user = data;

      console.table(data);
    });

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(Date.now());
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    test('OTP 요청시 secret이 없으면 BadRequest가 반환된다', async () => {
      // Given
      const otpRequest = {};

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/otp')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send(otpRequest)
        .expect(HttpStatusCode.BadRequest);

      // Then
      const body = response.body;
      const data = response.body.data;

      expect(body.error).toEqual('Bad Request');
      expect(body.statusCode).toEqual(HttpStatusCode.BadRequest);
      expect(data).toBeUndefined();
    });

    test('OTP를 생성하면 생성된 OTP는 6자리이고 Created가 반환된다.', async () => {
      // Given
      const otpRequest = {
        secret: '01012345678',
      };

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/otp')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send(otpRequest)
        .expect(HttpStatusCode.Created);

      // Then
      const body = response.body;
      const data = response.body.data;

      expect(body.statusCode).toEqual(HttpStatusCode.Created);
      expect(data).toBeDefined();
      expect(data.otp).toBeDefined();
      expect(data.otp.length).toEqual(6);
      expect(data.sendType).toBeUndefined();

      console.table(data);
    });

    test('OTP 생성 요청시 sendType을 지정하면 해당 OTP가 해당 sendType으로 전송된다.', async () => {
      // Given
      const otpRequest = {
        secret: '01012345678',
      };

      // When
      const response = await request(app.getHttpServer())
        .post('/v1/auth/otp')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .query({ sendType: 'sms' })
        .send(otpRequest)
        .expect(HttpStatusCode.Created);

      // Then
      const body = response.body;
      const data = response.body.data;

      expect(body.statusCode).toEqual(HttpStatusCode.Created);
      expect(data).toBeDefined();
      expect(data.otp).toBeDefined();
      expect(data.otp.length).toEqual(6);
      expect(data.sendType).toEqual('sms');

      console.table(data);
    });

    test('OTP는 생성 후 10분이 지나면 유효하지 않다.', async () => {
      // Given
      const otpRequest = {
        secret: '01012345678',
      };

      const otpResponse = await request(app.getHttpServer())
        .post('/v1/auth/otp')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send(otpRequest)
        .expect(HttpStatusCode.Created);

      const otp = otpResponse.body.data.otp;

      // When
      await jest.advanceTimersByTimeAsync(1000 * 60 * 11); // 11분 후

      console.log('now', new Date());

      const response = await request(app.getHttpServer())
        .post('/v1/auth/otp/verification')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send({
          secret: otpRequest.secret,
          otp: otp,
        })
        .expect(HttpStatusCode.Ok);

      // Then
      const body = response.body;
      const data = response.body.data;

      expect(body.statusCode).toEqual(HttpStatusCode.Ok);
      expect(data).toBeDefined();
      expect(data.otp).toBeDefined();
      expect(data.otp.length).toEqual(6);
      expect(data.verified).toBe(false);

      console.log('data');
      console.table(data);
    });
  });
});
