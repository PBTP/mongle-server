import { Global, Module } from '@nestjs/common';
import { S3Service } from './aws/s3/application/s3.service';
import { ConsumerModule } from '../broker/consumer/consumer.module';
@Global()
@Module({
  imports: [ConsumerModule],
  providers: [
    {
      provide: 'CloudStorageService',
      useClass: S3Service,
    },
  ],
  exports: ['CloudStorageService'],
})
export class CloudModule {}
