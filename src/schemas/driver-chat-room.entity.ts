import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Driver } from './drivers.entity';
import { ChatRoom } from './chat-room.entity';

export type TDriverChatRoom = {
  driverId: number;
  chatRoomId: number;
  created_at: Date;
  deletedAt: Date;
  driver: Driver;
  chatRoom: ChatRoom;
};

@Entity('driver_chat_rooms')
export class DriverChatRoom implements TDriverChatRoom {
  @PrimaryColumn()
  driverId: number;

  @PrimaryColumn()
  chatRoomId: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Driver, (driver) => driver.chatRooms)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.driverChatRooms)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;
}
