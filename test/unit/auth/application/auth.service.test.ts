import { AuthService } from '../../../../src/auth/application/auth.service';
import { CustomerService } from '../../../../src/customer/application/customer.service';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
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
import { SecurityService } from '../../../../src/auth/application/security.service';
import { FakeSecurityService } from '../../../mock/fake.security.service';
import { FakeSmsService } from '../../../mock/fake.sms.service';
import { Builder } from 'builder-pattern';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let customerService: CustomerService;
  const date: Date = new Date();

  const users = [
    {
      userType: 'customer' as UserType,
      uuid: 'test-uuid-1',
      name: '홍길동1',
      authProvider: AuthProvider.BASIC,
    },
    {
      userType: 'customer' as UserType,
      uuid: 'test-uuid-2',
      name: '홍길동2',
      authProvider: AuthProvider.BASIC,
    },
    {
      userType: 'customer' as UserType,
      uuid: 'test-uuid-3',
      name: '홍길동3',
      authProvider: AuthProvider.BASIC,
    },
  ];

  beforeEach(async () => {
    customerService = new CustomerService(
      new FakeCustomerRepository(),
      new SecurityService(new FakeConfigService()),
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
      new UserService(
        customerService,
        new DriverService(new FakeDriverRepository()),
        new BusinessService(new FakeBusinessRepository()),
      ),
      new FakeSecurityService(),
      new FakeCacheService(),
      new FakeSmsService(),
    );

    // 모든 사용자를 로그인 처리
    for (const user of users) {
      await service.login(user);
    }

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('login시 새로운 사용자인 경우 새로 DB에 등록된다.', async () => {
    const initUser: UserDto = {
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    expect(loginUser).toBeDefined();
    expect(loginUser?.userId).toBe(4);
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

    expect(loginUser.userId).toBe(4);
    expect(loginUser?.accessToken).toBeDefined();

    const decode = jwtService.decode(loginUser.accessToken!);

    console.table(decode);

    expect(decode).toBeDefined();
    expect(decode.tokenType).toBe('access');
    expect(decode.userType).toBe('customer');
    expect(decode.subject).toBe(4);
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

      expect(loginUser.userId).toBe(4);
      expect(loginUser?.refreshToken).toBeDefined();

      const decode = jwtService.decode(loginUser.refreshToken!);

      console.table(decode);

      expect(decode).toBeDefined();
      expect(decode.tokenType).toBe('refresh');
      expect(decode.userType).toBe('customer');
      expect(decode.subject).toBe(4);
    },
  );

  test('Token Refresh시 accessToken, refreshToken이 새로 발급된다.', async () => {
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

  test('accessToken이 만료되면 getUser 시 TokenExpiredError가 발생한다.', async () => {
    const initUser = {
      userType: 'customer' as UserType,
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    // 2시간 후로 시간을 진행
    jest.advanceTimersByTime(2 * 60 * 60 * 1000);

    // 비동기 함수가 예외를 발생시키는지 테스트
    await expect(service.getUser(loginUser.accessToken!)).rejects.toThrow(
      TokenExpiredError,
    );
  });

  describe('사용자별 고객 정보 조회 테스트 (GetUser)', () => {
    test.each(users)(
      '사용자  accessToken으로 고객 정보를 조회할 수 있다. %s',
      async (user) => {
        const loginUser = await service.login(user);

        const decode = jwtService.decode(loginUser.accessToken!);

        const findCustomer = await service.getUser(loginUser.accessToken!);

        expect(findCustomer).toBeDefined();
        expect(findCustomer).toStrictEqual({
          uuid: user.uuid,
          userId: decode?.subject,
          userType: user.userType,
          customerId: decode?.subject,
          customerName: user.name,
          customerPhoneNumber: undefined,
          customerAddress: undefined,
          customerDetailAddress: undefined,
          authProvider: user.authProvider,
          refreshToken: loginUser.refreshToken,
          createdAt: date,
          modifiedAt: date,
          deletedAt: undefined,
        });
      },
    );
  });

  describe('사용자별 고객 정보 조회 테스트 customerService.getOne', () => {
    test.each(users)(
      '사용자 accessToken으로 고객 정보를 조회할 수 있다. %s',
      async (user) => {
        const loginUser = await service.login(user);

        const decode = jwtService.decode(loginUser.accessToken!);

        const findCustomer = await customerService.getOne({
          userId: decode?.subject as number,
          userType: decode?.userType as UserType,
        });

        expect(findCustomer).toBeDefined();
        expect(findCustomer).toStrictEqual({
          uuid: user.uuid,
          userId: decode?.subject,
          userType: user.userType,
          customerId: decode?.subject,
          customerName: user.name,
          customerPhoneNumber: undefined,
          customerAddress: undefined,
          customerDetailAddress: undefined,
          authProvider: user.authProvider,
          refreshToken: loginUser.refreshToken,
          createdAt: date,
          modifiedAt: date,
          deletedAt: undefined,
        });
      },
    );
  });

  describe('인증번호 발급', () => {
    test('otp를 발급하면 otp가 생성된다.', async () => {
      const otp = await service.sendOtp('sms', '010-1234-5678');

      expect(otp).toBeDefined();
      // 6자리 숫자로 구성되어 있어야 한다.
      expect(otp.length).toBe(6);
      expect(Number(otp)).not.toBeNaN();
    });

    test('otp 검증이 성공 되면 user 정보를 업데이트 한다.', async () => {
      const user: UserDto = Builder(UserDto)
        .userType('customer')
        .name('홍길동')
        .uuid('test-uuid')
        .userId(4)
        .authProvider(AuthProvider.BASIC)
        .build();

      const loginUser = await service.login(user);

      const otp = await service.sendOtp('sms', '010-1234-5678');

      const result = await service.otpVerifyAndUserUpdate(
        loginUser,
        '010-1234-5678',
        otp,
      );

      const updateUser = await customerService.getOne(
        {
          userId: loginUser.userId,
          userType: loginUser.userType,
        },
        true,
      );

      expect(result).toBe(true);
      expect(updateUser).toBeDefined();
      expect(updateUser).toStrictEqual({
        uuid: user.uuid,
        userId: user.userId,
        userType: user.userType,
        customerId: user.userId,
        customerName: user.name,
        customerPhoneNumber: '010-1234-5678',
        customerAddress: undefined,
        customerDetailAddress: undefined,
        authProvider: user.authProvider,
        refreshToken: loginUser.refreshToken,
        createdAt: date,
        modifiedAt: date,
        deletedAt: undefined,
      });
    });

    test('otp 검증이 실패하면 user 정보를 업데이트 하지 않는다.', async () => {
      const user: UserDto = Builder(UserDto)
        .userType('customer')
        .name('홍길동')
        .uuid('test-uuid')
        .userId(4)
        .authProvider(AuthProvider.BASIC)
        .build();

      const loginUser = await service.login(user);

      const otp = await service.sendOtp('sms', '010-1234-5678');

      const result = await service.otpVerifyAndUserUpdate(
        loginUser,
        '010-1234-5678',
        '102922',
      );

      const updateUser = await customerService.getOne(
        {
          userId: loginUser.userId,
          userType: loginUser.userType,
        },
        true,
      );

      expect(result).toBe(false);
      expect(updateUser).toBeDefined();
      expect(updateUser).toStrictEqual({
        uuid: user.uuid,
        userId: user.userId,
        userType: user.userType,
        customerId: user.userId,
        customerName: user.name,
        customerPhoneNumber: undefined,
        customerAddress: undefined,
        customerDetailAddress: undefined,
        authProvider: user.authProvider,
        refreshToken: loginUser.refreshToken,
        createdAt: date,
        modifiedAt: date,
        deletedAt: undefined,
      });
    });
  });
});
