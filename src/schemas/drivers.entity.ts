import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Business } from './business.entity';
import { DriverChatRoom } from './driver-chat-room.entity';
import { HasUuid } from '../common/entity/parent.entity';

@Entity({ name: 'drivers' })
export class Driver extends HasUuid {
  @PrimaryColumn()
  public driverId: number;

  @Column()
  public driverName: string;

  @Column()
  public driverPhoneNumber: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Appointment, (appointments) => appointments.driver)
  public appointments: Appointment[];

  @OneToMany(() => DriverChatRoom, (chat) => chat.driver)
  public chatRooms: DriverChatRoom[];

  @ManyToOne(() => Business, (business) => business.drivers)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
