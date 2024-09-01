import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes } from 'crypto';
import { SMS_SERVICE, SmsService } from '../domain/sms-service.interface';
import { CacheService } from 'src/common/cache/cache.service';
import { EncryptionService } from 'src/encryption/application/encryption-service';
import { ENCRYPTION_SERVICE } from 'src/encryption/domain/encryption-service.interface';

@Injectable()
export class PhoneVerificationService {
  private readonly expiredMinutes: number;
  private readonly otpLength: number;
  private readonly otpSecret: string;

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    @Inject(SMS_SERVICE) private readonly smsService: SmsService,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,
  ) {
    this.expiredMinutes = this.configService.get<number>(
      'sms/expired_minutes',
      10,
    );
    this.otpLength = this.configService.get<number>('sms/otp_length', 6);
    this.otpSecret = this.configService.get<string>('sms/otp_secret');
  }

  async createVerification(phoneNumber: string): Promise<void> {
    const encryptedPhoneNumber = this.encryptionService.encrypt(phoneNumber);
    const verificationCode = this.generateOtp(encryptedPhoneNumber);
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + this.expiredMinutes);

    const phoneVerification = {
      phoneNumber: encryptedPhoneNumber,
      verificationCode,
      expiredAt: expiredAt.toISOString(),
      verifiedAt: null,
    };

    const cacheKey = this.getCacheKey(encryptedPhoneNumber);
    await this.cacheService.setData(
      cacheKey,
      phoneVerification,
      this.expiredMinutes * 60,
    );

    const message = `인증번호는 [${verificationCode}] 입니다.`;
    await this.smsService.sendSMS(phoneNumber, message);
  }

  private generateOtp(phoneNumber: string): string {
    const randomSalt = randomBytes(16).toString('hex');
    const data = `${phoneNumber}-${randomSalt}`;

    const hmac = createHmac('sha256', this.otpSecret);
    hmac.update(data);
    const hash = hmac.digest('hex');

    const otp = parseInt(hash, 16).toString().slice(0, this.otpLength);

    return otp;
  }

  async verifyCode(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<string | null> {
    const encryptedPhoneNumber = this.encryptionService.encrypt(phoneNumber);
    const cacheKey = this.getCacheKey(encryptedPhoneNumber);
    const phoneVerification = await this.cacheService.getData<any>(cacheKey);

    if (!phoneVerification) {
      return null;
    }

    const now = new Date();
    const expiredAt = new Date(phoneVerification.expiredAt);

    if (
      phoneVerification.verificationCode !== verificationCode ||
      expiredAt < now
    ) {
      return null;
    }

    phoneVerification.verifiedAt = now.toISOString();
    phoneVerification.verificationId = uuidv4();

    await this.cacheService.setData(
      cacheKey,
      phoneVerification,
      this.expiredMinutes * 60,
    );
    return phoneVerification.verificationId;
  }

  async isVerified(
    phoneNumber: string,
    verificationId: string,
  ): Promise<boolean> {
    const encryptedPhoneNumber = this.encryptionService.encrypt(phoneNumber);
    const cacheKey = this.getCacheKey(encryptedPhoneNumber);
    const phoneVerification = await this.cacheService.getData<any>(cacheKey);

    return (
      !!phoneVerification &&
      phoneVerification.verificationId === verificationId &&
      phoneVerification.verifiedAt !== null
    );
  }

  private getCacheKey(phoneNumber: string): string {
    return `phone-verification:${phoneNumber}`;
  }
}
