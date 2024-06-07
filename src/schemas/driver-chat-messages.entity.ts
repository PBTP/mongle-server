import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { DriverChat } from './driver-chats.entity';

@Entity({ name: 'driver_chat_messages' })
export class DriverChatMessage {
  @PrimaryColumn()
  public driverChatMessageId: number;

  @Column({ unique: true, type: 'uuid' })
  public senderUuid: string;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public driverChatMessageType: string;

  @Column()
  public driverChatMessageContent: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => DriverChat, (driverChats) => driverChats.driverChatMessages)
  @JoinColumn({ name: 'driver_chat_id' })
  public driverChat: DriverChat;
}
