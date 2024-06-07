import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryColumn()
  public imageId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public imageLink: string;

  @CreateDateColumn()
  public createdAt: Date;
}
