import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageDto, MetaData } from './dto/image.dto';
import { CloudStorageServiceInterface } from '../cloud/cloud.storage.service.interface';
import { Images } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @Inject('CloudStorageService')
    private readonly cloudStorageService: CloudStorageServiceInterface,
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
  ) {}

  async generatePreSignedUrl(
    key: string,
    metadata: MetaData[],
  ): Promise<string[]> {
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
