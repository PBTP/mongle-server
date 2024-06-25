import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'images' })
export class Images {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({ type: 'varchar', length: 44, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  imageLink: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}
