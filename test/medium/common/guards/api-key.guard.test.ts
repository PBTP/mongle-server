import { ApiKeyGuard } from "@common/guard/api-key.guard";
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: {
            get: () => 'test-api-key',
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
  });

  test('헤더에 x-api-key가 존재하지 않으면 false이다', () => {
    // given
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => null,
        }),
      }),
    } as any;

    // when
    const result = guard.canActivate(context);

    // then
    expect(result).toBeFalsy();
  });

  test('헤더에 x-api-key가 존재하지만 값이 일치하지 않으면 false이다', () => {
    // given
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'invalid-key',
        }),
      }),
    } as any;

    // when
    const result = guard.canActivate(context);

    // then
    expect(result).toBeFalsy();
  });

  test('헤더에 x-api-key가 존재하고 값이 일치하면 true이다', () => {
    // given
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'test-api-key',
        }),
      }),
    } as any;

    // when
    const result = guard.canActivate(context);

    // then
    expect(result).toBeTruthy();
  });
});
