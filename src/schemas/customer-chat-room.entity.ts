import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customers.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('customer_chat_rooms')
export class CustomerChatRoom {
  @PrimaryColumn()
  customerId: number;

  @PrimaryColumn()
  chatRoomId: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.chatRooms)
  @JoinColumn({ name: 'customer_id' })
  customer: Promise<Customer>;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.customerChatRooms)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: Promise<ChatRoom>;
}
