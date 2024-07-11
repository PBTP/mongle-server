import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ChatRoom } from './chat-rooms.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  // 필요한 다른 메시지 타입들
}

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  chat_message_id: number;

  @Column()
  chatRoomId: number;

  @Column({ type: 'char', length: 13 })
  sender_uuid: string;

  @Column({ type: 'char', length: 13, unique: true })
  tsid: string;

  @Column({ type: 'enum', enum: MessageType })
  chat_message_type: MessageType;

  @Column({ type: 'text' })
  chat_message_content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;
}
