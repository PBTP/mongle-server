import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';
import { Badges } from './badges.entity';

@Entity()
export class Business_badges {
  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @ManyToOne(() => Business, (business) => business.business_badges)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public businessId: number;

  @ManyToOne(() => Badges, (badges) => badges.business_badges)
  @JoinColumn({ name: 'badge_id' })
  @PrimaryColumn()
  public badgeId: number;

  public business: Business;
  public badge: Badges;
}
