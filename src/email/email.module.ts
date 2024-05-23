import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SystemAlarmModule } from '../config/system.alarm.module';

@Module({
  imports: [SystemAlarmModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
