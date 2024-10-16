import { Inject, Injectable, Logger } from "@nestjs/common";
import { ImageDto, ImageMetaDataDto } from "../presentation/image.dto";
import { ICloudStorage } from "../../cloud/cloud-storage.interface";
import { Image } from "../../../schemas/image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PresignedUrlDto } from "../../cloud/aws/s3/presentation/presigned-url.dto";

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @Inject('CloudStorageService')
    private readonly cloudStorageService: ICloudStorage,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async generatePreSignedUrls(
    key: string,
    metadata: ImageMetaDataDto[],
  ): Promise<PresignedUrlDto[]> {
    return await this.cloudStorageService.generatePreSignedUrls(key, metadata);
  }

  async create(dto: Partial<ImageDto>): Promise<Image> {
    return this.imageRepository
      .findOne({ where: { imageUrl: dto.imageUrl } })
      .then((v) => {
        if (!v) {
          const newImage = this.imageRepository.create(dto);
          return this.imageRepository.save(newImage).then((v) => {
            this.logger.log(`Image(${v.imageUrl}) created`);
            return v;
          });
        }
        return v;
      });
  }
}
