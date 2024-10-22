import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BusinessTag } from './business-tags.entity';

export type TTag = {
  tagId: number;
  tagName: string;
  businessTags: BusinessTag[];
};

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryColumn()
  public tagId: number;

  @Column()
  public tagName: string;

  @OneToMany(() => BusinessTag, (businessTags) => businessTags.tag)
  public businessTags: BusinessTag[];
}
