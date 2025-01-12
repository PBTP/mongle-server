import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthController } from '../../src/auth/presentation/auth.controller';
import { AuthService } from '../../src/auth/application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SmsModule } from '../../src/common/sender/sms/sms.module';
import { UserModule } from '../../src/auth/user.module';
import { CacheModule } from '../../src/common/cache/cache.module';
import { DriverModule } from '../../src/driver/driver.module';
import { SecurityModule } from '../../src/auth/application/security.module';
import { BusinessModule } from '../../src/business/business.module';
import { CustomerModule } from '../../src/customer/customer.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ImageModule } from '../../src/common/image/image.module';
import { CLOUD_STORAGE } from '../../src/common/cloud/aws/s3/application/s3.service';
import { FakeCloudStorageService } from '../mock/fake.cloud-storage.service';
import { CloudModule } from '../../src/common/cloud/cloud.module';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { IBackup, newDb } from 'pg-mem';

describe('AuthController E2E 테스트', () => {
  let redisContainer: StartedRedisContainer;
  let app: INestApplication;
  let backup: IBackup;

  beforeEach(async () => {
    jest.setTimeout(30000); // 30초 타임아웃 설정 (기본값은 5초)
    // Redis Testcontainers 설정
    redisContainer = await new RedisContainer().start();
    const redisHost = redisContainer.getHost();
    const redisPort = redisContainer.getMappedPort(6379);

    // pg-mem 설정
    const db = newDb();
    db.public.registerFunction({
      name: 'current_database',
      implementation: () => 'test_database',
    });

    db.public.registerFunction({
      name: 'version',
      implementation: () => '13.3',
    });

    const dataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [__dirname + '/../../src/**/*.entity.{ts,js}'],
      synchronize: false,
    });
    await dataSource.initialize();

    const moduleFutures = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: async () => ({ secret: 'test-secret' }),
        }),
        PassportModule.register({ defaultStrategy: 'access' }),
        SmsModule,
        UserModule,
        CacheModule,
        RedisModule.forRootAsync({
          useFactory: async () => ({
            config: { host: redisHost, port: redisPort },
            readyLog: true,
          }),
        }),
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
      .overrideProvider(CLOUD_STORAGE)
      .useClass(FakeCloudStorageService)
      .overrideProvider('TypeORMDataSource') // 데이터베이스 프로바이더 오버라이드
      .useValue(dataSource) // pg-mem 데이터 소스 주입
      .compile();

    backup = db.backup();

    app = moduleFutures.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await redisContainer.stop();
    await app.close();
    backup.restore();
  });

  test('e2e test ', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/login')
      .expect(200)
      .expect('Hello World!');
  });
});
