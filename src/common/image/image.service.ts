import { Inject, Injectable } from '@nestjs/common';
import { MetaData } from './dto/image.dto';
import { CloudStorageService } from "../cloud/cloudStorageService";

@Injectable()
export class ImageService {
  constructor(
    @Inject('CloudStorageService')
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async generatePreSignedUrl(
    key: string,
    metadata: MetaData,
    expiredTime: number = 60,
  ): Promise<string> {
    return await this.cloudStorageService.generatePreSignedUrl(
      key,
      metadata,
      expiredTime,
    );
  }
}
