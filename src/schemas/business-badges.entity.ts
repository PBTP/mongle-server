import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn,} from 'typeorm';
import {BusinessEntity} from './business.entity';
import {Badge} from './badges.entity';

@Entity({ name: 'business_badges' })
export class BusinessBadge {
  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => BusinessEntity, (business) => business.businessBadges)
  @JoinColumn({ name: 'business_id' })
  @PrimaryColumn()
  public businessId: number;

  @ManyToOne(() => Badge, (badges) => badges.businessBadges)
  @JoinColumn({ name: 'badge_id' })
  @PrimaryColumn()
  public badgeId: number;

  public business: BusinessEntity;
  public badge: Badge;
}
