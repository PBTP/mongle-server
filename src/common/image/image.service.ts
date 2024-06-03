import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImageService {
  private readonly s3Client: S3;
  private readonly bucketName: string = this.configService.get('s3/bucket_name');

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3({
      useAccelerateEndpoint: true,
      accessKeyId: this.configService.get('AWS_IAM_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_IAM_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async generatedPreSignedUrl(
    key: string,
    metadata: { ContentType: string; ContentLength: number; extension: string },
    expiredTime: number = 60,
  ): Promise<string> {
    return await this.s3Client.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiredTime,
    });
  }
}
