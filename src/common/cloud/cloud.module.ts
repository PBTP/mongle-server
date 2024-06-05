import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'CloudStorageService',
      useClass: S3Service,
    },
  ],
})
export class CloudModule {}
