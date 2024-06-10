import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageDto, MetaData } from '../presentation/image.dto';
import { CloudStorageInterface } from '../../cloud/cloud.storage.interface';
import { Images } from '../../../schemas/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresignedUrlDto } from '../../cloud/aws/s3/presentation/presigned-url.dto';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @Inject('CloudStorageService')
    private readonly cloudStorageService: CloudStorageInterface,
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
  ) {}

  async generatePreSignedUrls(
    key: string,
    metadata: MetaData[],
  ): Promise<PresignedUrlDto[]> {
    return await this.cloudStorageService.generatePreSignedUrls(key, metadata);
  }

  async create(dto: Partial<ImageDto>): Promise<Images> {
    return this.imageRepository
      .findOne({ where: { imageLink: dto.imageLink } })
      .then((v) => {
        if (!v) {
          const newImage = this.imageRepository.create(dto);
          return this.imageRepository.save(newImage).then((v) => {
            this.logger.log(`Image(${v.imageLink}) created`);
            return v;
          });
        }
        return v;
      });
  }
}
