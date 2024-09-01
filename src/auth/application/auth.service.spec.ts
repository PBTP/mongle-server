import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../common/cache/cache.service';
import { UserService } from './user.service';
import { AuthProvider, UserDto } from '../presentation/user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let cacheService: CacheService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), decode: jest.fn(), verify: jest.fn() },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            toUserDto: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    cacheService = module.get<CacheService>(CacheService);
    userService = module.get<UserService>(UserService);
  });

  it('로그인하고 토큰을 반환', async () => {
    const userDto: UserDto = {
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
    };

    jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(userService, 'create').mockResolvedValueOnce(userDto);
    jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce('test-access-token')
      .mockReturnValueOnce('test-refresh-token');
    jest.spyOn(cacheService, 'set').mockResolvedValueOnce(undefined);
    jest.spyOn(userService, 'update').mockResolvedValueOnce(userDto);

    const result = await service.login(userDto);

    expect(result).toEqual({
      uuid: 'test-uuid',
      authProvider: 'BASIC',
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    });
  });

  it('토큰을 새로 고쳐야 함', async () => {
    const req = {
      headers: {
        authorization: 'Bearer test-refresh-token',
      },
    };

    const userDto: UserDto = {
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
    };

    jest.spyOn(jwtService, 'decode').mockReturnValueOnce({
      tokenType: 'refresh',
      subject: 'test-uuid',
      userType: 'customer',
    });
    jest.spyOn(userService, 'findOne').mockResolvedValueOnce(userDto);
    jest.spyOn(userService, 'toUserDto').mockReturnValue(userDto);
    jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce('test-new-access-token')
      .mockReturnValueOnce('test-new-refresh-token');
    jest.spyOn(cacheService, 'set').mockResolvedValueOnce('OK');
    jest.spyOn(userService, 'update').mockResolvedValueOnce(userDto);

    const result = await service.tokenRefresh(req as any);

    expect(result).toEqual({
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
      accessToken: 'test-new-access-token',
      refreshToken: 'test-new-refresh-token',
    });
  });
});
