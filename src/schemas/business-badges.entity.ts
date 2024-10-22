import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Business } from './business.entity';
import { Badge } from './badges.entity';

export type TBusinessBadge = {
  createdAt: Date;
  business: Business;
  badge: Badge;
};

@Entity({ name: 'business_badges' })
export class BusinessBadge implements TBusinessBadge {
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
