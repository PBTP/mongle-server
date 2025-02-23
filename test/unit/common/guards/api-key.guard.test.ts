import { ApiKeyGuard } from '../../../../src/common/guard/api-key.guard';
import { FakeConfigService } from '../../../mock/fake.config.service';
describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(async () => {
    guard = new ApiKeyGuard(new FakeConfigService());
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
