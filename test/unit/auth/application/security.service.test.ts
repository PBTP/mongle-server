import {SecurityService} from '../../../../src/auth/application/security.service';
import {FakeConfigService} from '../../../mock/fake.config.service';

describe('SecurityService Test', () => {
  let service: SecurityService;

  beforeEach(() => {
    service = new SecurityService(new FakeConfigService());

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('암호화', () => {
    const text = 'test';
    const encrypted = service.encrypt(text);
    console.table({ text, encrypted });
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(text);
  });

  test('복호화', () => {
    const text = 'test';
    const encrypted = service.encrypt(text);
    const decrypted = service.decrypt(encrypted!);
    console.table({ text, encrypted, decrypted });
    expect(decrypted).toBe(text);
  });

  test('otp 생성', async () => {
    const otp = await service.generateOtp('010-1111-1111');
    console.table({ otp });
    expect(otp).toBeDefined();
    expect(otp.length).toBe(6);
    expect(otp).toMatch(/^[0-9]{6}$/);
  });

  test('otp는 10분이 지나기전에 말료되지 않는다', async () => {
    const otp = await service.generateOtp('010-1111-1111');
    const result = await service.validateOtp('010-1111-1111', otp);
    console.table({ otp, result });
    expect(result).toBe(true);
  });

  test('otp는 10분 후 만료 된다.', async () => {
    const otp = await service.generateOtp('010-1111-1111');
    jest.advanceTimersByTime(600000);
    const result = await service.validateOtp('010-1111-1111', otp);
    console.table({ otp, result });
    expect(result).toBe(false);
  });

});
