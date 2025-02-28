import { ICloudStorage } from '../../src/common/cloud/cloud-storage.interface';
import { ImageMetaDataDto } from '../../src/common/image/presentation/image.dto';
import {
  defaultExpiredTime,
  PresignedUrlDto,
} from '../../src/common/cloud/aws/s3/presentation/presigned-url.dto';

export class FakeCloudStorage implements ICloudStorage {
  async generatePreSignedUrl(
    key: string,
    metadata: ImageMetaDataDto,
    expiredTime: number = defaultExpiredTime,
  ): Promise<PresignedUrlDto> {
    return {
      url: key,
      expiredTime: expiredTime,
      fileName: metadata.fileName,
      fileSize: metadata.fileSize,
    };
  }
  async generatePreSignedUrls(
    key: string,
    metadata: ImageMetaDataDto[],
  ): Promise<PresignedUrlDto[]> {
    return [
      {
        url: key,
        expiredTime: metadata[0].expiredTime ?? defaultExpiredTime,
        fileName: metadata[0].fileName,
        fileSize: metadata[0].fileSize,
      },
    ];
  }
}
