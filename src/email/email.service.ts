import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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
    await this.transporter.sendMail({
      from: this.configService.get<string>('email_default_sender'),
      to,
      subject,
      text,
      html,
    });

    await this.sendToDiscord(to, subject, text);
  }

  private async sendToDiscord(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const discordWebhookUrl = this.configService.get<string>(
      'discord_webhook_url',
    );
    if (!discordWebhookUrl) {
      console.error('Discord webhook URL is not set');
      return;
    }

    const message = {
      content: `**Email Sent**\n\n**To:** ${to}\n**Subject:** ${subject}\n${text}`,
    };

    try {
      await axios.post(discordWebhookUrl, message);
    } catch (error) {
      console.error('Error sending message to Discord:', error);
    }
  }
}
