import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { BusinessChatRoom } from '../../schemas/business-chat-room.entity';
import { IChatService } from './chat.interface';

@Injectable()
export class BusinessChatService implements IChatService {
  private readonly logger = new Logger(BusinessChatService.name);

  constructor(
    @InjectRepository(BusinessChatRoom)
    private readonly driverChatRoomRepository: Repository<BusinessChatRoom>,
  ) {}

  async getChatRooms(): Promise<BusinessChatRoom[]> {
    return await this.driverChatRoomRepository.find();
  }

  async getChatRoomById(
    businessId: number,
    chatRoomId: number,
  ): Promise<BusinessChatRoom> {
    return await this.driverChatRoomRepository.findOne({
      where: { businessId, chatRoomId },
    });
  }

  async createChatRoom(dto: ChatRoomDto): Promise<BusinessChatRoom> {
    const newRoom = this.driverChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      businessId: dto.inviteUserId,
    });

    return await this.driverChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Business Chat room created: ${room.chatRoomId}`);
      return room;
    });
  }
}
