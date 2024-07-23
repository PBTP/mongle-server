import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CustomerChatRoom } from './customer-chat-room.entity';
import { DriverChatRoom } from './driver-chat-room.entity';
import { BusinessChatRoom } from './business-chat-room.entity';
import { ChatMessage } from './chat-message.entity';
import { HasTsid } from '../common/entity/parent.entity';

@Entity('chat_rooms')
export class ChatRoom extends HasTsid {
  @PrimaryGeneratedColumn()
  chatRoomId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  chatRoomName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

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
}
