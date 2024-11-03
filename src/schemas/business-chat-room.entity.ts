import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { BusinessEntity } from './business.entity';

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

  @ManyToOne(() => BusinessEntity, (business) => business.chatRooms)
  business: BusinessEntity;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.businessChatRooms)
  chatRoom: Promise<ChatRoom>;
}
