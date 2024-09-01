import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SmsService } from '../domain/sms-service.interface';

@Injectable()
export class AligoService implements SmsService {
  private apiUrl: string;
  private userId: string;
  private key: string;
  private senderNumber: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = 'https://apis.aligo.in/send/';
    this.userId = this.configService.get<string>('sms/aligo_user_id');
    this.key = this.configService.get<string>('sms/aligo_key');
    this.senderNumber = this.configService.get<string>(
      'sms/aligo_sender_number',
    );
  }

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append('user_id', this.userId);
    formData.append('key', this.key);
    formData.append('msg', message);
    formData.append('receiver', phoneNumber);
    formData.append('sender', this.senderNumber);

    axios
      .post(this.apiUrl, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((response) => {
        if (response.data.result_code !== '1') {
          throw new HttpException(
            'Failed to send SMS',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      })
      .catch((error) => {
        throw new HttpException(
          'Failed to send SMS',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
