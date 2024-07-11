import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Point,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { BusinessBadge } from './business-badges.entity';
import { BusinessChat } from './business-chats.entity';
import { BusinessNotice } from './business-notices.entity';
import { BusinessTag } from './business-tags.entity';
import { Driver } from './drivers.entity';
import { Favorite } from './favorites.entity';
import { Review } from './reviews.entity';
import { ServiceOption } from './service-options.entity';
import { BusinessChatRoom } from './business-chat-room.entity';

@Entity({ name: 'business' })
export class Business {
  @PrimaryColumn()
  public businessId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public businessName: string;

  @Column()
  public businessPhoneNumber: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  public businessLocation: Point;

  @Column()
  public businessPriceGuide: string;

  @Column()
  public businessRule: string;

  @Column({ type: 'date' })
  public openingDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => BusinessChat, (businessChats) => businessChats.business)
  public businessChats: BusinessChat[];

  @OneToMany(() => Favorite, (favorites) => favorites.business)
  public favorites: Favorite[];

  @OneToMany(() => Review, (reviews) => reviews.business)
  public reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.business)
  public appointments: Appointment[];

  @OneToMany(() => Driver, (drivers) => drivers.business)
  public drivers: Driver[];

  @OneToMany(() => ServiceOption, (serviceOptions) => serviceOptions.business)
  public serviceOptions: ServiceOption[];

  @OneToMany(() => BusinessBadge, (businessBadges) => businessBadges.business)
  public businessBadges: BusinessBadge[];

  @OneToMany(() => BusinessTag, (businessTags) => businessTags.business)
  public businessTags: BusinessTag[];

  @OneToMany(
    () => BusinessNotice,
    (businessNotices) => businessNotices.business,
  )
  public businessNotices: BusinessNotice[];

  @OneToMany(() => BusinessChatRoom, (chatRooms) => chatRooms.chatRoom)
  public chatRooms: BusinessChatRoom[];
}
