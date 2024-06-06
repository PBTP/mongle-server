import { MetaData } from '../image/dto/image.dto';

export interface CloudStorageServiceInterface {
  generatePreSignedUrl(
    key: string,
    metadata: MetaData,
    expiredTime: number,
  ): Promise<string>;

  generatePreSignedUrls(key: string, metadata: MetaData[]): Promise<string[]>;
}
