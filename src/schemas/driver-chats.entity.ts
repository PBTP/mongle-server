import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from './customers.entity';
import { DriverChatMessage } from './driver-chat-messages.entity';
import { Driver } from './drivers.entity';

@Entity({ name: 'driver_chats' })
export class DriverChat {
  @PrimaryColumn()
  public driverChatId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToMany(
    () => DriverChatMessage,
    (driverChatMessages) => driverChatMessages.driverChat,
  )
  public driverChatMessages: DriverChatMessage[];

  @ManyToOne(() => Driver, (drivers) => drivers.driverChats)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @ManyToOne(() => Customer, (customers) => customers.driverChats)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;
}
