import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from '../../schemas/chat-rooms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from '../../schemas/chat-message.entity';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { CustomerChatService } from './customer-chat.service';
import { DriverChatService } from './driver-chat.service';
import { BusinessChatService } from './business-chat.service';
import { Customer } from '../../schemas/customers.entity';

@Injectable()
export class ChatService {
  private readonly roomServices = {};
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    private readonly driverChatService: DriverChatService,
    private readonly customerChatService: CustomerChatService,
    private readonly businessChatService: BusinessChatService,
  ) {
    this.roomServices['driver'] = driverChatService;
    this.roomServices['customer'] = customerChatService;
    this.roomServices['business'] = businessChatService;
  }

  async getChatRooms(): Promise<ChatRoom[]> {
    return await this.chatRepository.find();
  }

  async getChatRoomById(chatRoomId: number): Promise<ChatRoom> {
    return await this.chatRepository.findOne({
      where: { chatRoomId },
    });
  }

  async createChatRoom(
    dto: ChatRoomDto,
    customer: Customer,
  ): Promise<ChatRoom> {
    const newRoom = await this.chatRepository.save(
      this.chatRepository.create(dto),
    );

    dto.chatRoomId = newRoom.chatRoomId;
    await this.roomServices[dto.inviteUser.userType]!.createChatRoom(dto);

    return newRoom;
  }
}
