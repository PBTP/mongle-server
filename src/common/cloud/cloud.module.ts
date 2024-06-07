import { Global, Module } from '@nestjs/common';
import { S3Service } from './aws/s3/application/s3.service';
import { SQSModule } from './aws/sqs/sqs.module';

@Global()
@Module({
  imports: [SQSModule],
  providers: [
    {
      provide: 'CloudStorageService',
      useClass: S3Service,
    },
  ],
  exports: ['CloudStorageService'],
})
export class CloudModule {}
