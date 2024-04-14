import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointments } from './appointments.entity';
import { Business_badges } from './business-badges.entity';
import { Business_chats } from './business-chats.entity';
import { Business_notices } from './business-notices.entity';
import { Business_tags } from './business-tags.entity';
import { Drivers } from './drivers.entity';
import { Favorites } from './favorites.entity';
import { Reviews } from './reviews.entity';
import { Service_options } from './service-options.entity';

@Entity()
export class Business {
  @PrimaryColumn()
  @ApiProperty({ example: 'business_id 예시', description: 'business_id 설명' })
  public business_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({
    example: 'business_name 예시',
    description: 'business_name 설명',
  })
  public business_name: string;

  @Column()
  @ApiProperty({
    example: 'business_phone_number 예시',
    description: 'business_phone_number 설명',
  })
  public business_phone_number: string;

  @Column()
  @ApiProperty({
    example: 'business_location 예시',
    description: 'business_location 설명',
  })
  public business_location: string;

  @Column()
  @ApiProperty({
    example: 'business_price_guide 예시',
    description: 'business_price_guide 설명',
  })
  public business_price_guide: string;

  @Column()
  @ApiProperty({
    example: 'business_rule 예시',
    description: 'business_rule 설명',
  })
  public business_rule: string;

  @Column({ type: 'date' })
  @ApiProperty({
    example: 'opening_date 예시',
    description: 'opening_date 설명',
  })
  public opening_date: Date;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Business_chats, (business_chats) => business_chats.business)
  public business_chats: Business_chats[];

  @OneToMany(() => Favorites, (favorites) => favorites.business)
  public favorites: Favorites[];

  @OneToMany(() => Reviews, (reviews) => reviews.business)
  public reviews: Reviews[];

  @OneToMany(() => Appointments, (appointments) => appointments.business)
  public appointments: Appointments[];

  @OneToMany(() => Drivers, (drivers) => drivers.business)
  public drivers: Drivers[];

  @OneToMany(
    () => Service_options,
    (service_options) => service_options.business,
  )
  public service_options: Service_options[];

  @OneToMany(
    () => Business_badges,
    (business_badges) => business_badges.business,
  )
  public business_badges: Business_badges[];

  @OneToMany(() => Business_tags, (business_tags) => business_tags.business)
  public business_tags: Business_tags[];

  @OneToMany(
    () => Business_notices,
    (business_notices) => business_notices.business,
  )
  public business_notices: Business_notices[];
}
