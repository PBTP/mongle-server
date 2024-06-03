import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { Badge } from './badges.entity';

@Entity({ name: 'business_badges' })
export class BusinessBadge {
  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => Business, (business) => business.businessBadges)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public businessId: number;

  @ManyToOne(() => Badge, (badges) => badges.businessBadges)
  @JoinColumn({ name: 'badge_id' })
  @PrimaryColumn()
  public badgeId: number;

  public business: Business;
  public badge: Badge;
}
