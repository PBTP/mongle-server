import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  imageLink: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}
