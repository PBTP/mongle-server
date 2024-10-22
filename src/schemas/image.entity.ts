import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HasUuid } from '../common/entity/parent.entity';
import { Image } from '../common/image/image.domain';
import { Builder } from 'builder-pattern';

export type TImage = {
  imageId: number;
  uuid: string;
  imageUrl: string;
  createdAt: Date;
}

@Entity({ name: 'images', orderBy: { imageUrl: 'ASC' } })
export class ImageEntity extends HasUuid {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ type: 'varchar', length: 44, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  imageUrl: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  static from(dto: Image): ImageEntity {
    return Builder<ImageEntity>()
      .imageId(dto.imageId)
      .uuid(dto.uuid)
      .imageUrl(dto.imageUrl)
      .createdAt(dto.createdAt)
      .build();
  }

  toModel() {
    return Builder<Image>()
      .imageId(this.imageId)
      .uuid(this.uuid)
      .imageUrl(this.imageUrl)
      .createdAt(this.createdAt)
      .build();
  }
}
