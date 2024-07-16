import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { Business } from './business.entity';

@Entity('business_chat_rooms')
export class BusinessChatRoom {
  @PrimaryColumn()
  businessId: number;

  @PrimaryColumn()
  chatRoomId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Business, (business) => business.chatRooms)
  business: Business;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.businessChatRooms)
  chatRoom: ChatRoom;
}
