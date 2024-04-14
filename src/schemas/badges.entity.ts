import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business_badges } from './business-badges.entity';

@Entity()
export class Badges {
  @PrimaryColumn()
  @ApiProperty({ example: 'badge_id 예시', description: 'badge_id 설명' })
  public badge_id: number;

  @Column()
  @ApiProperty({ example: 'badge_name 예시', description: 'badge_name 설명' })
  public badge_name: string;

  @Column()
  @ApiProperty({
    example: 'badge_description 예시',
    description: 'badge_description 설명',
  })
  public badge_description: string;

  @OneToMany(() => Business_badges, (business_badges) => business_badges.badge)
  public business_badges: Business_badges[];
}
