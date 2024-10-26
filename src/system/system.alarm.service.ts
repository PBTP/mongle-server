import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type Channel = {
  provider: string;
  webHookUrls: { channel: string; url: string }[];
};

@Injectable()
export class SystemAlarmService {
  private readonly logAlarmInfo: Channel;
  private readonly logger = new Logger(SystemAlarmService.name);

  constructor(private readonly configService: ConfigService) {
    this.logAlarmInfo = JSON.parse(
      <string>configService.get('system/alarm'),
    ) as Channel;
  }

  async alarm(channelName: string, message: string): Promise<void> {
    const channel = this.logAlarmInfo.webHookUrls.find(
      (v) => v.channel === channelName,
    );

    if (channel) {
      await axios.post(channel.url, { content: message }).catch((error) => {
        this.logger.error(
          `Error sending message to ${this.logAlarmInfo.provider}:`,
          error,
        );
      });
    }
  }
}
