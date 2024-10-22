import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Business } from './business.entity';
import { Tag } from './tags.entity';

export type TBusinessTag = {
  tag: Tag;
  business: Business;
  createdAt: Date;
  businessId: number;
};

@Entity({ name: 'business_tags' })
export class BusinessTag implements TBusinessTag {
  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => Business, (business) => business.businessTags)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public businessId: number;

  @ManyToOne(() => Tag, (tags) => tags.businessTags)
  @JoinColumn({ name: 'tag_id' })
  @PrimaryColumn()
  public tagId: number;

  public business: Business;
  public tag: Tag;
}
