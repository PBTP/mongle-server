import { ImageMetaDataDto } from "../image/presentation/image.dto";
import { PresignedUrlDto } from "./aws/s3/presentation/presigned-url.dto";

export interface ICloudStorage {
  generatePreSignedUrl(
    key: string,
    metadata: ImageMetaDataDto,
    expiredTime: number,
  ): Promise<PresignedUrlDto>;

  generatePreSignedUrls(
    key: string,
    metadata: ImageMetaDataDto[],
  ): Promise<PresignedUrlDto[]>;
}
