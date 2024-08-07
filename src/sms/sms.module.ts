import { AligoService } from './application/aligo.service';
import { Module } from '@nestjs/common';
import { SMS_SERVICE } from './domain/sms-service.interface';

@Module({
  providers: [
    {
      provide: SMS_SERVICE,
      useClass: AligoService,
    },
  ],
  exports: [SMS_SERVICE],
})
export class SmsModule {}
