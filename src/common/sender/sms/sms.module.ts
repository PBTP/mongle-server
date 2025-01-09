import {Module} from '@nestjs/common';
import {SMS_SERVICE, SmsService} from './application/sms.service';

@Module({
  providers: [
    {
      provide: SMS_SERVICE,
      useClass: SmsService,
    },
  ],
  exports: [
    {
      provide: SMS_SERVICE,
      useClass: SmsService,
    },
  ],
})
export class SmsModule {}
