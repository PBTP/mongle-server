import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BusinessChat } from './business-chats.entity';

@Entity({ name: 'business_chat_messages' })
export class BusinessChatMessage {
  @PrimaryColumn()
  public businessChatMessageId: number;

  @Column({ unique: true, type: 'uuid' })
  public senderUuid: string;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public businessChatMessageType: string;

  @Column()
  public businessChatMessageContent: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(
    () => BusinessChat,
    (businessChats) => businessChats.businessChatMessages,
  )
  @JoinColumn({ name: 'business_chat_id' })
  public businessChat: BusinessChat;
}
