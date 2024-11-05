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
  UserType,
} from '../../../../src/auth/presentation/user.dto';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let customerService: CustomerService;
  const date: Date = new Date();

  beforeEach(async () => {
    customerService = new CustomerService(
      new FakeCustomerRepository(),
      new FakeSecurityService(),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new FakeUuidHolder(),
      new FakeDateHolder(date),
    );

    const configService = new FakeConfigService();

    const accessTokenOption = {
      secret: configService.get('jwt/access/secret'),
      expiresIn: configService.get('jwt/access/expire'),
    };

    jwtService = new JwtService(accessTokenOption);
    service = new AuthService(
      jwtService,
      configService,
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
    jest.useFakeTimers();
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    // iat, exp는 1초 단위로 계산되기 때문에 1초 이상의 시간을 흘려야 한다.
    jest.advanceTimersByTime(2000);

    const refreshUser = await service.tokenRefresh(loginUser.refreshToken!);

    console.table(loginUser);
    console.table(refreshUser);

    expect(refreshUser).toBeDefined();
    expect(refreshUser.accessToken).toBeDefined();
    expect(refreshUser.refreshToken).toBeDefined();
    expect(refreshUser.accessToken).not.toBe(loginUser.accessToken);
    expect(refreshUser.refreshToken).not.toBe(loginUser.refreshToken);
  });

  test('loging한 후 받은 accessToken으로 getUser를 호출해 유저 정보를 조회 할 수 있다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);
    const findCustomer = await service.getUser(loginUser.accessToken!);

    console.table(findCustomer);

    expect(findCustomer).toBeDefined();
    expect(findCustomer).toStrictEqual({
      uuid: 'test-uuid',
      userId: 1,
      userType: 'customer',
      authProvider: AuthProvider.BASIC,
      customerId: 1,
      customerName: '홍길동',
      customerAddress: undefined,
      customerDetailAddress: undefined,
      customerPhoneNumber: undefined,
      refreshToken: loginUser.refreshToken,
      createdAt: date,
      modifiedAt: date,
      deletedAt: undefined,
    });
  });

  test('loging한 후 받은 accessToken으로 고객의 정보를 조회할 수 있다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    const decode = jwtService.decode(loginUser.accessToken!);
    console.table(decode);

    const findCustomer = await customerService.getOne({
      userId: decode?.subject as number,
      userType: decode?.userType as UserType,
    });

    expect(findCustomer).toBeDefined();
    expect(findCustomer).toStrictEqual({
      uuid: 'test-uuid',
      userId: 1,
      userType: 'customer',
      customerId: 1,
      customerName: '홍길동',
      customerPhoneNumber: undefined,
      customerAddress: undefined,
      customerDetailAddress: undefined,
      authProvider: AuthProvider.BASIC,
      refreshToken: loginUser.refreshToken,
      createdAt: date,
      modifiedAt: date,
      deletedAt: undefined,
    });
  });
});
