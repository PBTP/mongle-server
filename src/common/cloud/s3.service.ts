import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { MetaData } from '../image/dto/image.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { CloudStorageService } from './cloudStorageService';

@Injectable()
export class S3Service implements CloudStorageService {
  private readonly s3Client: S3;
  private readonly bucketName: string =
    this.configService.get('s3/bucket_name');
  private readonly env: string = this.configService.get('NODE_ENV');
  private readonly supportExtensions: string[] = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'svg',
  ];

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3({
      useAccelerateEndpoint: true,
      accessKeyId: this.configService.get('AWS_IAM_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_IAM_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async generatePreSignedUrl(
    key: string,
    metadata: MetaData,
    expiredTime: number = 60,
  ): Promise<string> {
    const split = metadata.fileName.split('.');
    const fileExtension = split[split.length - 1];

    if (!this.supportExtensions.includes(fileExtension)) {
      throw new BadRequestException('지원하지 않는 확장자입니다.');
    }

    return await this.s3Client.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: `${this.env}/images/${key}.${fileExtension}`,
      Expires: expiredTime,
    });
  }
}
