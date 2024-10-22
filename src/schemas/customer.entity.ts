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
import { Image } from './image.entity';

export type TCustomer = {
  customerId: number;
  customerName: string;
  customerPhoneNumber?: string;
  customerAddress?: string;
  customerDetailAddress?: string;
  customerLocation?: Point;
  authProvider: AuthProvider;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt?: Date;
  refreshToken?: string;
  favorites: Favorite[];
  reviews: Review[];
  appointments: Appointment[];
  pets: Pet[];
  chatRooms: CustomerChatRoom[];
};

@Entity({ name: 'customers' })
export class Customer extends HasUuid implements TCustomer {
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
  profileImage?: Image;
}
