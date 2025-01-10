import { Global, Module } from '@nestjs/common';
import { SystemAlarmService } from './system.alarm.service';

@Global()
@Module({
  providers: [SystemAlarmService],
  exports: [SystemAlarmService],
})
export class SystemAlarmModule {}
