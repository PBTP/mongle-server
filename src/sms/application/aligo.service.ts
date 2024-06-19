import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AligoService {
  private apiUrl: string;
  private userId: string;
  private key: string;
  private senderNumber: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = 'https://apis.aligo.in/send/';
    this.userId = this.configService.get<string>('aligo_user_id');
    this.key = this.configService.get<string>('aligo_key');
    this.senderNumber = this.configService.get<string>('aligo_sender_number');
  }

  async sendVerificationCode(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<void> {
    const formData = new URLSearchParams();
    formData.append('user_id', this.userId);
    formData.append('key', this.key);
    formData.append('msg', `인증번호는 [${verificationCode}] 입니다.`);
    formData.append('receiver', phoneNumber);
    formData.append('sender', this.senderNumber);

    try {
      const response = await axios.post(this.apiUrl, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.data.result_code !== '1') {
        throw new HttpException(
          'Failed to send SMS',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Failed to send SMS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
