import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { CustomerChatRoom } from './customer-chat-room.entity';
import { DriverChatRoom } from './driver-chat-room.entity';
import { BusinessChatRoom } from './business-chat-room.entity';
import { ChatMessage } from './chat-message.entity';
import { getTsid } from 'tsid-ts';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  chatRoomId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  chatRoomName: string;

  @Column({ type: 'char', length: 13, unique: true })
  tsid: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(
    () => CustomerChatRoom,
    (customerChatRoom) => customerChatRoom.chatRoom,
  )
  customerChatRooms: CustomerChatRoom[];

  @OneToMany(() => DriverChatRoom, (driverChatRoom) => driverChatRoom.chatRoom)
  driverChatRooms: DriverChatRoom[];

  @OneToMany(
    () => BusinessChatRoom,
    (businessChatRoom) => businessChatRoom.chatRoom,
  )
  businessChatRooms: BusinessChatRoom[];

  @OneToMany(() => ChatMessage, (message) => message.chatRoom)
  messages: ChatMessage[];

  @BeforeInsert()
  generateTSID() {
    this.tsid = getTsid().toString();
  }
}
