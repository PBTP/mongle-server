import { Image } from '../../src/common/image/image.domain';
import { IImageRepository } from '../../src/common/image/port/image.repository';


export class FakeImageRepository implements IImageRepository {
  images: Image[] = []

  create(image: Partial<Image>): Image {
    return image as Image;
  }
  async findOne(image: Partial<Image>): Promise<Image> {
      return this.images.find((i) => i.imageUrl === image.imageUrl);
  }
  async save(image: Image): Promise<Image> {
    this.images.push(image);
    return image;
  }
}
