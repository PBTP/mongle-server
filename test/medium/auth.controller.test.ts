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
          useFactory: async () => ({ secret: 'test-secret' })
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
        CloudModule
      ],
      controllers: [AuthController],
      providers: [AuthService]
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
        password: 'password'
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
        phoneNumber: '01012345678'
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
        name: 'test'
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
        name: 'test'
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
        customerId: 1
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
});
