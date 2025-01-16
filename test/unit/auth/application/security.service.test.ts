import { SecurityService } from '../../../../src/auth/application/security.service';
import { FakeConfigService } from '../../../mock/fake.config.service';

describe('SecurityService Test', () => {
  let service: SecurityService;

  beforeEach(() => {
    service = new SecurityService(new FakeConfigService());

    jest.useFakeTimers();
    jest.setSystemTime(Date.now());
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Encrypt/Decrypt', () => {
    test('암호화', () => {
      // Given
      const text = 'test';

      // When
      const encrypted = service.encrypt(text);

      // Then
      console.table({ text, encrypted });
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(text);
    });

    test('복호화', () => {
      // Given
      const text = 'test';

      // When
      const encrypted = service.encrypt(text);
      const decrypted = service.decrypt(encrypted!);

      // Then
      console.table({ text, encrypted, decrypted });
      expect(decrypted).toBe(text);
    });
  });

  describe('OTP', () => {
    const testOtpSecrets = ['01012345678', '010-8765-4321', '010-1111-1111'];

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(Date.now());
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    test.each(testOtpSecrets)('otp 생성 - %s', async (secret) => {
      // Given
      const otp = await service.generateOtp(secret);

      // When
      // Then
      console.table({ secret, otp });
      expect(otp).toBeDefined();
      expect(otp.length).toBe(6);
      expect(otp).toMatch(/^[0-9]{6}$/);
    });

    test.each(testOtpSecrets)(
      'otp는 10분 후 만료 된다 for %s',
      async (secret: string) => {
        // Given
        const otp = await service.generateOtp(secret);

        // When
        // 11분 후
        jest.advanceTimersByTime(1000 * 60 * 11);

        // Then
        const result = await service.validateOtp(secret, otp);
        console.table({ otp, result });
        expect(result).toBe(false);
      },
    );
  });
});
