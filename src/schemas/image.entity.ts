import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HasUuid } from '../common/entity/parent.entity';

@Entity({ name: 'images', orderBy: { imageLink: 'ASC' } })
export class Image extends HasUuid {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ type: 'varchar', length: 44, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  imageLink: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}
