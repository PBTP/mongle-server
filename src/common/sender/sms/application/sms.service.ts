import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SolapiMessageService } from 'solapi';
import { BadRequestException } from '@nestjs/common/exceptions';
export const SMS_SERVICE = Symbol('SMS_SERVICE');

export interface ISmsService {
  send(phoneNumber: string, message: string): Promise<boolean>;
}

@Injectable()
export class SmsService implements ISmsService {
  private readonly senderNumber: string;
  private readonly logger = new Logger(SmsService.name);

  private solapiMessageService: SolapiMessageService;

  constructor(private readonly configService: ConfigService) {
    this.solapiMessageService = new SolapiMessageService(
      <string>this.configService.get('sms/key'),
      <string>this.configService.get('sms/secret'),
    );

    this.senderNumber = <string>this.configService.get('sms/sender_number');
  }

  async send(phoneNumber: string, message: string): Promise<boolean> {
    if (!phoneNumber || !message) {
      throw new BadRequestException('전화번호 또는 메시지가 없습니다.');
    }

    return await this.solapiMessageService
      .sendOne({
        to: phoneNumber,
        from: this.senderNumber,
        text: message,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        this.logger.error(err);
        return false;
      });
  }
}
