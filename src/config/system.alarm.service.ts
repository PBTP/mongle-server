import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type Channel = {
  provider: string;
  webHookUrls: { channel: string; url: string }[];
};

@Injectable()
export class SystemAlarmService {
  private readonly logAlarmInfo: Channel = this.configService.get<Channel>('system/alarm');

  constructor(private readonly configService: ConfigService) {}

  async alarm(channel: string, message: string): Promise<void> {
    await axios
      .post(
        this.logAlarmInfo.webHookUrls.find((v) => v.channel === channel).url,
        message,
      )
      .catch((error) => {
        console.error('Error sending message to Discord:', error);
      });
  }
}
