import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { Business } from './business.entity';

export type TBusinessChatRoom = {
  businessId: number;
  chatRoomId: number;
  createdAt: Date;
  deletedAt: Date;
  business: Business;
  chatRoom: Promise<ChatRoom>;
};

@Entity('business_chat_rooms')
export class BusinessChatRoom implements TBusinessChatRoom {
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
  chatRoom: Promise<ChatRoom>;
}
