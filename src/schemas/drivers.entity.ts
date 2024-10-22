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
import { Business } from './business.entity';
import { DriverChatRoom } from './driver-chat-room.entity';
import { HasUuid } from '../common/entity/parent.entity';
import { AuthProvider } from '../auth/presentation/user.dto';

export type TDriver = {
  uuid: string;
  driverId: number;
  driverName: string;
  driverPhoneNumber: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  business: Business;
  authProvider: AuthProvider;
  refreshToken?: string;
};

@Entity({ name: 'drivers' })
export class Driver extends HasUuid implements TDriver {
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

  @ManyToOne(() => Business, (business) => business.drivers)
  @JoinColumn({ name: 'business_id' })
  business: Business;

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
