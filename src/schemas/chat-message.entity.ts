import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { HasTsid } from '../common/entity/parent.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  // 필요한 다른 메시지 타입들
}

@Entity('chat_messages')
export class ChatMessage extends HasTsid {
  @PrimaryColumn({ type: 'int', nullable: false })
  chatMessageId: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  chatRoomId: number;

  @Column({ type: 'char', length: 13, nullable: false })
  senderUuid: string;

  @Column({ type: 'enum', enum: MessageType })
  chatMessageType: MessageType;

  @Column({ type: 'text' })
  chatMessageContent: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;
}
