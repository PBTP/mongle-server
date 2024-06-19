import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneVerification } from 'src/schemas/phone-verification.entity';
import { Not, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PhoneVerificationRepository } from '../domain/phone-verification.repository';
import { AligoService } from './aligo.service';

const EXPIRED_MINUTES = 3;

@Injectable()
export class PhoneVerificationService {
  constructor(
    @InjectRepository(PhoneVerification)
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
    private readonly aligoService: AligoService,
  ) {}

  async createVerification(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<PhoneVerification> {
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + EXPIRED_MINUTES);

    const phoneVerification = this.phoneVerificationRepository.create({
      phoneNumber,
      verificationCode,
      expiredAt,
    });

    await this.aligoService.sendVerificationCode(phoneNumber, verificationCode);

    return await this.phoneVerificationRepository.save(phoneVerification);
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
