import { AuthService } from '../../../../src/auth/application/auth.service';
import { CustomerService } from '../../../../src/customer/application/customer.service';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeSecurityService } from '../../../mock/fake.security.service';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { JwtService } from '@nestjs/jwt';
import { FakeConfigService } from '../../../mock/fake.config.service';
import { FakeCacheService } from '../../../mock/fake.cache.service';
import { UserService } from '../../../../src/auth/application/user.service';
import { DriverService } from '../../../../src/driver/application/driver.service';
import { FakeDriverRepository } from '../../../mock/fake.driver.repository';
import { BusinessService } from '../../../../src/business/application/business.service';
import { FakeBusinessRepository } from '../../../mock/fake.business.repsitory';
import {
  AuthProvider,
  UserDto,
} from '../../../../src/auth/presentation/user.dto';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  const date: Date = new Date();

  beforeEach(async () => {
    const customerService = new CustomerService(
      new FakeCustomerRepository(),
      new FakeSecurityService(),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new FakeUuidHolder(),
      new FakeDateHolder(date),
    );
    jwtService = new JwtService();
    service = new AuthService(
      jwtService,
      new FakeConfigService(),
      new FakeCacheService(),
      new UserService(
        customerService,
        new DriverService(new FakeDriverRepository()),
        new BusinessService(new FakeBusinessRepository()),
      ),
    );
  });

  test('login시 새로운 사용자인 경우 새로 DB에 등록된다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    expect(loginUser).toBeDefined();
    expect(loginUser?.userId).toBe(1);
    expect(loginUser?.userType).toBe('customer');
    expect(loginUser?.name).toBe('홍길동');
    expect(loginUser?.authProvider).toBe(AuthProvider.BASIC);
    expect(loginUser?.uuid).toBe('test-uuid');
    expect(loginUser?.accessToken).toBeDefined();
    expect(loginUser?.refreshToken).toBeDefined();
  });

  test('login시 기존 사용자인 경우 DB에 등록되지 않는다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);
    const existsUser = await service.login(loginUser);

    expect(loginUser).toBeDefined();
    expect(existsUser).toBeDefined();
    expect(loginUser).toStrictEqual(existsUser);
  });

  test('Token Decode시 accessToken subject에 userId, userType, tokenType이가 들어있다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    expect(loginUser.userId).toBe(1);
    expect(loginUser?.accessToken).toBeDefined();

    const decode = jwtService.decode(loginUser.accessToken!);

    console.table(decode);

    expect(decode).toBeDefined();
    expect(decode.tokenType).toBe('access');
    expect(decode.userType).toBe('customer');
    expect(decode.subject).toBe(1);
  });

  test(
    'Token Decode시 refreshToken subject에 ' +
      'userId, userType, tokenType이가 들어있다.',
    async () => {
      const initUser: UserDto = {
        userType: 'customer',
        name: '홍길동',
        authProvider: AuthProvider.BASIC,
      };

      const loginUser = await service.login(initUser);

      expect(loginUser.userId).toBe(1);
      expect(loginUser?.refreshToken).toBeDefined();

      const decode = jwtService.decode(loginUser.refreshToken!);

      console.table(decode);

      expect(decode).toBeDefined();
      expect(decode.tokenType).toBe('refresh');
      expect(decode.userType).toBe('customer');
      expect(decode.subject).toBe(1);
    },
  );

  test('Token Refresh시 accessToken, refreshToken이 새로 발급된다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    const refreshUser = await service.tokenRefresh(loginUser.refreshToken!);

    console.table(loginUser);
    console.table(refreshUser);

    expect(refreshUser).toBeDefined();
    expect(refreshUser.accessToken).toBeDefined();
    expect(refreshUser.refreshToken).toBeDefined();
    expect(refreshUser.accessToken).not.toBe(loginUser.accessToken);
    expect(refreshUser.refreshToken).not.toBe(loginUser.refreshToken);
  });
});
