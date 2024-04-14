import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customers } from './customers.entity';
import { Driver_chat_messages } from './driver-chat-messages.entity';
import { Drivers } from './drivers.entity';

@Entity()
export class Driver_chats {
  @PrimaryColumn()
  @ApiProperty({
    example: 'driver_chat_id 예시',
    description: 'driver_chat_id 설명',
  })
  public driver_chat_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @OneToMany(
    () => Driver_chat_messages,
    (driver_chat_messages) => driver_chat_messages.driver_chat,
  )
  public driver_chat_messages: Driver_chat_messages[];

  @ManyToOne(() => Drivers, (drivers) => drivers.driver_chats)
  @JoinColumn({ name: 'driver_id' })
  public driver: Drivers;

  @ManyToOne(() => Customers, (customers) => customers.driver_chats)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;
}
