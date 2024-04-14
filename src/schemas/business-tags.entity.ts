import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';
import { Tags } from './tags.entity';

@Entity()
export class Business_tags {
  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @ManyToOne(() => Business, (business) => business.business_tags)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public business_id: number;

  @ManyToOne(() => Tags, (tags) => tags.business_tags)
  @JoinColumn({ name: 'tag_id' })
  @PrimaryColumn()
  public tag_id: number;

  public business: Business;
  public tag: Tags;
}
