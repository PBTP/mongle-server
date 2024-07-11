import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Driver } from './drivers.entity';
import { ChatRoom } from './chat-rooms.entity';

@Entity('driver_chat_rooms')
export class DriverChatRoom {
  @PrimaryColumn()
  driverId: number;

  @PrimaryColumn()
  chatRoomId: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Driver, (driver) => driver.chatRooms)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.driverChatRooms)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;
}
