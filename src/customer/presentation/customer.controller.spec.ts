import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/application/auth.service';
import { AuthController } from '../../auth/presentation/auth.controller';
import { AuthProvider, UserDto } from '../../auth/presentation/user.dto';

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
              accessToken: 'test-access-token',
              refreshToken: 'test-refresh-token',
            }),
            tokenRefresh: jest.fn().mockResolvedValue({
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

  it('로그인하고 토큰을 반환', async () => {
    const userDto: UserDto = {
      uuid: 'test-uuid',
      authProvider: AuthProvider.BASIC,
    };

    const result = await controller.login(userDto);

    expect(result).toEqual({
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
      accessToken: 'test-new-access-token',
      refreshToken: 'test-new-refresh-token',
    });
    expect(service.tokenRefresh).toBeCalledWith(req);
  });
});
