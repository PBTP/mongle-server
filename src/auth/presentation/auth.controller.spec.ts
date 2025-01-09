import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from '../application/auth.service';
import {AuthProvider, UserDto} from './user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              uuid: 'test-uuid',
              authProvider: AuthProvider.BASIC,
              accessToken: 'test-access-token',
              refreshToken: 'test-refresh-token',
            }),
            tokenRefresh: jest.fn().mockResolvedValue({
              uuid: 'test-uuid',
              authProvider: AuthProvider.BASIC,
              accessToken: 'test-new-access-token',
              refreshToken: 'test-new-refresh-token',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('로그인', async () => {
    const userDto: UserDto = {
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
    };

    const result = await controller.login(userDto);

    expect(result).toEqual({
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    });
    expect(service.login).toBeCalledWith(userDto);
  });

  it('레프레시 토큰 재발급', async () => {
    const req = {
      headers: {
        authorization: 'Bearer test-refresh-token',
      },
    };

    const result = await controller.refresh(req as any);

    expect(result).toEqual({
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
      accessToken: 'test-new-access-token',
      refreshToken: 'test-new-refresh-token',
    });
    expect(service.tokenRefresh).toBeCalledWith(req);
  });
});
