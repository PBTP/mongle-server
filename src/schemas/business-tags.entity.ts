import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn,} from 'typeorm';
import {BusinessEntity} from './business.entity';
import {Tag} from './tags.entity';

@Entity({ name: 'business_tags' })
export class BusinessTag {
  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => BusinessEntity, (business) => business.businessTags)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public businessId: number;

  @ManyToOne(() => Tag, (tags) => tags.businessTags)
  @JoinColumn({ name: 'tag_id' })
  @PrimaryColumn()
  public tagId: number;

  public business: BusinessEntity;
  public tag: Tag;
}
