import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { BusinessBadge } from './business-badges.entity';

@Entity({ name: 'badges' })
export class Badge {
  @PrimaryColumn()
  public badgeId: number;

  @Column()
  public badgeName: string;

  @Column()
  public badgeDescription: string;

  @OneToMany(() => BusinessBadge, (businessBadges) => businessBadges.badge)
  public businessBadges: BusinessBadge[];
}
