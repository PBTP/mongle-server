import { MetaData } from '../image/dto/image.dto';

export interface CloudStorageService {
  generatePreSignedUrl(
    key: string,
    metadata: MetaData,
    expiredTime: number,
  ): Promise<string>;
}
