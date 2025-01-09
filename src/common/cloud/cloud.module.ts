import {Global, Module} from '@nestjs/common';
import {CLOUD_STORAGE, S3Service} from './aws/s3/application/s3.service';
import {ConsumerModule} from '../broker/consumer/consumer.module';

@Global()
@Module({
  imports: [ConsumerModule],
  providers: [
    {
      provide: CLOUD_STORAGE,
      useClass: S3Service,
    },
  ],
  exports: [CLOUD_STORAGE],
})
export class CloudModule {}
