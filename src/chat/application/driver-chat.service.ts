import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { DriverChatRoom } from '../../schemas/driver-chat-room.entity';
import { IChatService } from './chat.interface';

@Injectable()
export class DriverChatService implements IChatService {
  private readonly logger = new Logger(DriverChatService.name);

  constructor(
    @InjectRepository(DriverChatRoom)
    private readonly driverChatRoomRepository: Repository<DriverChatRoom>,
  ) {}

  async getChatRooms(): Promise<DriverChatRoom[]> {
    return await this.driverChatRoomRepository.find();
  }

  async getChatRoomById(
    driverId: number,
    chatRoomId: number,
  ): Promise<DriverChatRoom> {
    return await this.driverChatRoomRepository.findOne({
      where: { driverId, chatRoomId },
    });
  }

  async createChatRoom(dto: ChatRoomDto): Promise<DriverChatRoom> {
    const newRoom = this.driverChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      driverId: dto.inviteUser.userId,
    });

    return await this.driverChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Driver Chat room created: ${room.chatRoomId}`);
      return room;
    });
  }
}
