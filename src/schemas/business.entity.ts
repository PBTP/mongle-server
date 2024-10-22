import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  Point,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { BusinessBadge } from './business-badges.entity';
import { BusinessNotice } from './business-notices.entity';
import { BusinessTag } from './business-tags.entity';
import { Driver } from './drivers.entity';
import { Favorite } from './favorites.entity';
import { Review } from './reviews.entity';
import { ServiceOption } from './service-options.entity';
import { BusinessChatRoom } from './business-chat-room.entity';
import { HasUuid } from '../common/entity/parent.entity';
import { AuthProvider } from '../auth/presentation/user.dto';

export type TBusiness = {
  businessId: number;
  businessName: string;
  businessPhoneNumber: string;
  businessLocation: Point;
  businessPriceGuide: string;
  businessRule: string;
  openingDate: Date;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  favorites: Favorite[];
  reviews: Review[];
  appointments: Appointment[];
  drivers: Driver[];
  serviceOptions: ServiceOption[];
  businessBadges: BusinessBadge[];
  businessTags: BusinessTag[];
  businessNotices: BusinessNotice[];
  chatRooms: BusinessChatRoom[];
  authProvider: AuthProvider;
  refreshToken?: string;
};

@Entity({ name: 'business' })
export class Business extends HasUuid implements TBusiness {
  @PrimaryColumn()
  businessId: number;

  @Column({
    nullable: false,
  })
  businessName: string;

  @Column({
    nullable: true,
  })
  businessPhoneNumber: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  businessLocation: Point;

  @Column({
    nullable: true,
  })
  businessPriceGuide: string;

  @Column({
    nullable: true,
  })
  businessRule: string;

  @Column({ type: 'date', nullable: true })
  openingDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Favorite, (favorites) => favorites.business)
  favorites: Favorite[];

  @OneToMany(() => Review, (reviews) => reviews.business)
  reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.business)
  appointments: Appointment[];

  @OneToMany(() => Driver, (drivers) => drivers.business)
  drivers: Driver[];

  @OneToMany(() => ServiceOption, (serviceOptions) => serviceOptions.business)
  serviceOptions: ServiceOption[];

  @OneToMany(() => BusinessBadge, (businessBadges) => businessBadges.business)
  businessBadges: BusinessBadge[];

  @OneToMany(() => BusinessTag, (businessTags) => businessTags.business)
  businessTags: BusinessTag[];

  @OneToMany(
    () => BusinessNotice,
    (businessNotices) => businessNotices.business,
  )
  businessNotices: BusinessNotice[];

  @OneToMany(() => BusinessChatRoom, (chatRooms) => chatRooms.chatRoom)
  chatRooms: BusinessChatRoom[];

  @Column({
    type: 'enum',
    enum: AuthProvider,
    enumName: 'auth_provider',
    nullable: false,
  })
  authProvider: AuthProvider;

  @Column({ length: 20, unique: true, nullable: true })
  refreshToken?: string;
}
