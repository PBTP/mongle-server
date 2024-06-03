import { Module } from '@nestjs/common';
import { LoggerService } from './logger.config';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
