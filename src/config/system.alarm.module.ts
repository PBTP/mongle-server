import { Module } from '@nestjs/common';
import { SystemAlarmService } from './system.alarm.service';

@Module({
  providers: [SystemAlarmService],
  exports: [SystemAlarmService],
})
export class SystemAlarmModule {}
