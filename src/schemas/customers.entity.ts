import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Point } from 'typeorm';
import { Appointment } from './appointments.entity';
import { BusinessChat } from './business-chats.entity';
import { DriverChat } from './driver-chats.entity';
import { Favorite } from './favorites.entity';
import { Pet } from './pets.entity';
import { Review } from './reviews.entity';

export enum AuthProvider {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column({ type: 'varchar', length: 44, unique: true, nullable: false })
  uuid: string;

  @Column({ length: 30, nullable: false })
  customerName: string;

  @Column({ length: 20, nullable: true })
  customerPhoneNumber?: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  customerLocation?: Point;

  @Column({ length: 100, nullable: true })
  customerAddress?: string;

  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  authProvider: AuthProvider;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  modifiedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ length: 20, unique: true, nullable: true })
  refreshToken?: string;

  @OneToMany(() => BusinessChat, (businessChats) => businessChats.customer)
  public businessChats: BusinessChat[];

  @OneToMany(() => Favorite, (favorites) => favorites.customer)
  public favorites: Favorite[];

  @OneToMany(() => Review, (reviews) => reviews.customer)
  public reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.customer)
  public appointments: Appointment[];

  @OneToMany(() => DriverChat, (driverChats) => driverChats.customer)
  public driverChats: DriverChat[];

  @OneToMany(() => Pet, (pets) => pets.customer)
  public pets: Pet[];
}
