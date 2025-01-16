import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { BusinessEntity } from './business.entity';
import { DriverChatRoom } from './driver-chat-room.entity';
import { UserEntity } from '../common/entity/user.entity';

@Entity({ name: 'drivers' })
export class DriverEntity extends UserEntity {
  @PrimaryColumn()
  driverId: number;

  @Column()
  driverName: string;

  @Column()
  driverPhoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Appointment, (appointments) => appointments.driver)
  appointments: Appointment[];

  @OneToMany(() => DriverChatRoom, (chat) => chat.driver)
  chatRooms: DriverChatRoom[];

  @ManyToOne(() => BusinessEntity, (business) => business.drivers)
  @JoinColumn({ name: 'business_id' })
  business: BusinessEntity;

  @Column({ length: 20, unique: true, nullable: true })
  refreshToken?: string;
}
