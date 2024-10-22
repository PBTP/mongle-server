import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('customer_chat_rooms')
export class CustomerChatRoom {
  @PrimaryColumn()
  customerId: number;

  @PrimaryColumn()
  chatRoomId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.chatRooms)
  @JoinColumn({ name: 'customer_id' })
  customer: Promise<CustomerEntity>;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.customerChatRooms)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: Promise<ChatRoom>;
}
