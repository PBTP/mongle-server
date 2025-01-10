import { Module } from '@nestjs/common';
import SSMConfigService from './ssm-config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  providers: [SSMConfigService],
  exports: [SSMConfigService],
})
export class SSMConfigModule {}
