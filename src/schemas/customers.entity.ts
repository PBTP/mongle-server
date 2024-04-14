import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointments } from './appointments.entity';
import { Business_chats } from './business-chats.entity';
import { Driver_chats } from './driver-chats.entity';
import { Favorites } from './favorites.entity';
import { Pets } from './pets.entity';
import { Reviews } from './reviews.entity';

@Entity()
export class Customers {
  @PrimaryColumn()
  @ApiProperty({ example: 'customer_id 예시', description: 'customer_id 설명' })
  public customer_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({
    example: 'customer_name 예시',
    description: 'customer_name 설명',
  })
  public customer_name: string;

  @Column()
  @ApiProperty({
    example: 'customer_phone_number 예시',
    description: 'customer_phone_number 설명',
  })
  public customer_phone_number: string;

  @Column()
  @ApiProperty({
    example: 'customer_location 예시',
    description: 'customer_location 설명',
  })
  public customer_location: string;

  @Column()
  @ApiProperty({
    example: 'auth_provider 예시',
    description: 'auth_provider 설명',
  })
  public auth_provider: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Business_chats, (business_chats) => business_chats.customer)
  public business_chats: Business_chats[];

  @OneToMany(() => Favorites, (favorites) => favorites.customer)
  public favorites: Favorites[];

  @OneToMany(() => Reviews, (reviews) => reviews.customer)
  public reviews: Reviews[];

  @OneToMany(() => Appointments, (appointments) => appointments.customer)
  public appointments: Appointments[];

  @OneToMany(() => Driver_chats, (driver_chats) => driver_chats.customer)
  public driver_chats: Driver_chats[];

  @OneToMany(() => Pets, (pets) => pets.customer)
  public pets: Pets[];
}
