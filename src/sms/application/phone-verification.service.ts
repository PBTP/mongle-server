import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneVerification } from 'src/schemas/phone-verification.entity';
import { Not, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PhoneVerificationRepository } from '../domain/phone-verification.repository';
import { AligoService } from './aligo.service';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes } from 'crypto';

@Injectable()
export class PhoneVerificationService {
  private readonly expiredMinutes: number;
  private readonly otpLength: number;
  private readonly otpSecret: string;

  constructor(
    @InjectRepository(PhoneVerification)
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
    private readonly aligoService: AligoService,
    private readonly configService: ConfigService,
  ) {
    this.expiredMinutes = this.configService.get<number>(
      'sms/expired_minutes',
      10,
    );
    this.otpLength = this.configService.get<number>('sms/otp_length', 6);
    this.otpSecret = this.configService.get<string>('sms/otp_secret');
  }

  async createVerification(phoneNumber: string): Promise<PhoneVerification> {
    const verificationCode = this.generateOtp(phoneNumber);
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + this.expiredMinutes);

    const phoneVerification = this.phoneVerificationRepository.create({
      phoneNumber,
      verificationCode,
      expiredAt,
    });

    const message = `인증번호는 [${verificationCode}] 입니다.`;
    await this.aligoService.sendSMS(phoneNumber, message);

    return await this.phoneVerificationRepository.save(phoneVerification);
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
  ): Promise<string> {
    const phoneVerification = await this.phoneVerificationRepository.findOne({
      where: {
        phoneNumber,
        verificationCode,
        verifiedAt: IsNull(),
        expiredAt: Not(IsNull()),
      },
    });

    if (!phoneVerification) {
      return null;
    }

    const now = new Date();
    if (phoneVerification.expiredAt < now) {
      return null;
    }

    phoneVerification.verifiedAt = now;
    phoneVerification.verificationId = uuidv4();
    await this.phoneVerificationRepository.save(phoneVerification);
    return phoneVerification.verificationId;
  }

  async isVerified(
    phoneNumber: string,
    verificationId: string,
  ): Promise<boolean> {
    const phoneVerification = await this.phoneVerificationRepository.findOne({
      where: {
        phoneNumber,
        verificationId,
        verifiedAt: Not(IsNull()),
      },
    });
    return !!phoneVerification;
  }
}
