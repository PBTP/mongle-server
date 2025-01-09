import {Image} from '../../src/common/image/image.domain';
import {IImageRepository} from '../../src/common/image/port/image.repository';

export class FakeImageRepository implements IImageRepository {
  images: Image[] = [];

  create(image: Partial<Image>): Image {
    return image as Image;
  }
  async findOne(image: Partial<Image>): Promise<Image> {
    const findImage = this.images.find((i) => i.imageUrl === image.imageUrl);
    if (!findImage) {
      throw new Error('존재하지 않는 이미지입니다.');
    }
    return findImage;
  }
  async save(image: Image): Promise<Image> {
    this.images.push(image);
    return image;
  }
}
