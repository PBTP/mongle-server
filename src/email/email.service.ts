import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { SystemAlarmService } from '../system/system.alarm.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly systemAlarmService: SystemAlarmService,
  ) {
    const ses = new AWS.SES({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_IAM_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_IAM_SECRET_ACCESS_KEY'),
      },
    });

    this.transporter = nodemailer.createTransport({
      SES: { ses, aws: AWS },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    await this.transporter
      .sendMail({
        from: this.configService.get<string>('email_default_sender'),
        to,
        subject,
        text,
        html,
      })
      .then(() => {
        this.systemAlarmService.alarm(
          'emailSend',
          `**Email Sent**\n\n**To:** ${to}\n**Subject:** ${subject}\n${text}`,
        );
      });
  }
}
