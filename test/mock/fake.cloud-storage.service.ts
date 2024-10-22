import { PresignedUrlDto } from 'src/common/cloud/aws/s3/presentation/presigned-url.dto';
import { ImageMetaDataDto } from 'src/common/image/presentation/image.dto';
import { ICloudStorage } from '../../src/common/cloud/cloud-storage.interface';

export class FakeCloudStorageService implements ICloudStorage {

  async generatePreSignedUrl(key: string, metadata: ImageMetaDataDto, expiredTime: number): Promise<PresignedUrlDto> {
      return {
          url: 'url',
          expiredTime: 60,
          fileName: 'fileName',
          fileSize: 1000
      }
  }
  async generatePreSignedUrls(key: string, metadata: ImageMetaDataDto[]): Promise<PresignedUrlDto[]> {
      return [{
          url: 'url',
          expiredTime: 60,
          fileName: 'fileName',
          fileSize: 1000
      }]
  }
}
