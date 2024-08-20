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
import { AuthProvider } from '../auth/presentation/user.dto';

@Entity({ name: 'drivers' })
export class Driver extends HasUuid {
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
