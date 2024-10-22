import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BusinessBadge } from './business-badges.entity';

export type TBadge = {
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  businessBadges: BusinessBadge[];
};

@Entity({ name: 'badges' })
export class Badge implements TBadge {
  @PrimaryColumn()
  public badgeId: number;

  @Column()
  public badgeName: string;

  @Column()
  public badgeDescription: string;

  @OneToMany(() => BusinessBadge, (businessBadges) => businessBadges.badge)
  public businessBadges: BusinessBadge[];
}
