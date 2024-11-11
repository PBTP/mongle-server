import { ICloudStorage } from '../../src/common/cloud/cloud-storage.interface';
import { ImageMetaDataDto } from '../../src/common/image/presentation/image.dto';
import { PresignedUrlDto } from '../../src/common/cloud/aws/s3/presentation/presigned-url.dto';

export class FakeImageService {

  constructor(
    private readonly cloudStorageService: ICloudStorage
  ) {
  }

  async generatePreSignedUrls(
    key: string,
    metadata: ImageMetaDataDto[],
  ): Promise<PresignedUrlDto[]> {
    return await this.cloudStorageService.generatePreSignedUrls(key, metadata);
  }
}
