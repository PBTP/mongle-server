import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Favorite } from './favorites.entity';
import { Pet } from './pets.entity';
import { Review } from './reviews.entity';
import { CustomerChatRoom } from './customer-chat-room.entity';
import { HasUuid } from '../common/entity/parent.entity';
import { AuthProvider } from '../auth/presentation/user.dto';
import { ImageEntity } from './image.entity';
import { TCustomer } from '../customer/customer.domain';
import { Builder } from 'builder-pattern';

export interface UUIDHolder {
  generatedUuid(): string;
}

export interface DateHolder {
  now(): Date;
}

@Entity({ name: 'customers' })
export class CustomerEntity extends HasUuid implements TCustomer{
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column({ length: 30, nullable: false })
  customerName: string;

  @Column({ nullable: true })
  customerPhoneNumber?: string;

  @Column({ nullable: true })
  customerAddress?: string;

  @Column({ nullable: true })
  customerDetailAddress?: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  customerLocation?: Point;

  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  authProvider: AuthProvider;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  modifiedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ unique: true, nullable: true })
  refreshToken?: string;

  @OneToMany(() => Favorite, (favorites) => favorites.customer)
  favorites: Favorite[];

  @OneToMany(() => Review, (reviews) => reviews.customer)
  reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.customer)
  appointments: Appointment[];

  @OneToMany(() => Pet, (pets) => pets.customer)
  pets: Pet[];

  @OneToMany(() => CustomerChatRoom, (room) => room.chatRoom)
  chatRooms: CustomerChatRoom[];

  // not column properties
  profileImage?: ImageEntity;

  static from(customer: TCustomer, uuidHolder:UUIDHolder, dateHolder: DateHolder): CustomerEntity {
    return Builder<CustomerEntity>()
      .customerId(customer.customerId)
      .customerName(customer.customerName)
      .customerPhoneNumber(customer.customerPhoneNumber)
      .customerAddress(customer.customerAddress)
      .customerDetailAddress(customer.customerDetailAddress)
      .customerLocation(customer.customerLocation)
      .authProvider(customer.authProvider)
      .createdAt(dateHolder.now())
      .modifiedAt(dateHolder.now())
      .deletedAt(null)
      .refreshToken(customer.refreshToken)
      .favorites(customer.favorites)
      .reviews(customer.reviews)
      .appointments(customer.appointments)
      .pets(customer.pets)
      .chatRooms(customer.chatRooms)
      .uuid(uuidHolder.generatedUuid())
      .build()
  }
}
