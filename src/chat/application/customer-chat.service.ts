import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerChatRoom } from '../../schemas/customer-chat-room.entity';
import { Repository } from 'typeorm';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { IChatService } from './chat.interface';

@Injectable()
export class CustomerChatService implements IChatService {
  private readonly logger = new Logger(CustomerChatService.name);
  constructor(
    @InjectRepository(CustomerChatRoom)
    private readonly customerChatRoomRepository: Repository<CustomerChatRoom>,
  ) {}

  async findAllChatRoom(): Promise<CustomerChatRoom[]> {
    return await this.customerChatRoomRepository.find();
  }

  async findChatRoom(
    customerId: number,
    chatRoomId: number,
  ): Promise<CustomerChatRoom> {
    return await this.customerChatRoomRepository.findOne({
      where: { customerId, chatRoomId },
    });
  }

  async createChatRoom(dto: ChatRoomDto): Promise<CustomerChatRoom> {
    const newRoom = this.customerChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      customerId: dto.inviteUser.userId,
    });

    return await this.customerChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Customer Chat room created: ${room.chatRoomId}`);
      return room;
    });
  }
}
