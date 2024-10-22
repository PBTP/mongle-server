import { ImageEntity } from '../../../schemas/image.entity';
import { ImageDto } from '../presentation/image.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from '../image.domain';

export const IMAGE_REPOSITORY = Symbol('IImageRepository');

export interface IImageRepository {
  create(image: Partial<Image>): Image;

  findOne(image: Partial<Image>): Promise<Image>;

  save(image: Image): Promise<Image>;
}


@Injectable()
export class ImageRepository implements IImageRepository {

  constructor(
    private readonly imageDB: Repository<ImageEntity>
  ) {
  }

  create(image: Partial<ImageDto>): Image {
    return this.imageDB.create(image).toModel();
  }

  async findOne(image: Partial<ImageDto>): Promise<Image> {
    return this.imageDB.findOne({ where: { imageUrl: image.imageUrl } }).then((v) => v.toModel());
  }

  async save(image: ImageEntity): Promise<Image> {
    return this.imageDB.save(image).then((v) => v.toModel())
  }

}
