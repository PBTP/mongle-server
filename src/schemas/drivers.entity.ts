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
import { DriverChat } from './driver-chats.entity';
import { DriverChatRoom } from './driver-chat-room.entity';

@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryColumn()
  public driverId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

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

  @OneToMany(() => DriverChat, (driverChats) => driverChats.driver)
  public driverChats: DriverChat[];

  @OneToMany(() => DriverChatRoom, (chat) => chat.driver)
  public chatRooms: DriverChatRoom[];

  @ManyToOne(() => Business, (business) => business.drivers)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
