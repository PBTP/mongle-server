import { MetaData } from '../image/presentation/image.dto';

export interface CloudStorageServiceInterface {
  generatePreSignedUrl(
    key: string,
    metadata: MetaData,
    expiredTime: number,
  ): Promise<string>;

  generatePreSignedUrls(key: string, metadata: MetaData[]): Promise<string[]>;
}
