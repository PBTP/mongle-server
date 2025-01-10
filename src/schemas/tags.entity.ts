import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { BusinessTag } from './business-tags.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryColumn()
  public tagId: number;

  @Column()
  public tagName: string;

  @OneToMany(() => BusinessTag, (businessTags) => businessTags.tag)
  public businessTags: BusinessTag[];
}
