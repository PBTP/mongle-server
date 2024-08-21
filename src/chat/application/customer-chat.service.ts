import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerChatRoom } from '../../schemas/customer-chat-room.entity';
import { Repository } from 'typeorm';
import { IChatService } from './chat.interface';
import { CustomerService } from '../../customer/application/customer.service';
import { UserDto } from '../../auth/presentation/user.dto';
import { plainToInstance as toDto } from 'class-transformer';
import { ChatRoomDto } from '../presentation/chat.dto';
import { ChatRoom } from '../../schemas/chat-room.entity';
import { ChatMessage } from '../../schemas/chat-message.entity';

@Injectable()
export class CustomerChatService implements IChatService {
  private readonly logger = new Logger(CustomerChatService.name);

  constructor(
    @InjectRepository(CustomerChatRoom)
    private readonly customerChatRoomRepository: Repository<CustomerChatRoom>,
    private readonly customerService: CustomerService,
  ) {}

  async exitsUserRoom(user: UserDto, chatRoomId: number): Promise<boolean> {
    this.logger.log(`Check user room: ${user.userId} ${chatRoomId}`);
    return await this.customerChatRoomRepository.exists({
      where: { customerId: user.userId, chatRoomId },
    });
  }

  async findChatRooms(user: UserDto): Promise<ChatRoomDto[]> {
    const customerChatRooms = await this.customerChatRoomRepository
      .createQueryBuilder('CCR')
      .where('CCR.customerId = :customerId', { customerId: user.userId })
      .innerJoinAndMapOne(
        'CCR.chatRoom',
        ChatRoom,
        'chatRoom',
        'CCR.chatRoomId = chatRoom.chatRoomId',
      )
      .leftJoinAndMapOne(
        'chatRoom.lastMessage',
        ChatMessage,
        'lastMessage',
        'lastMessage.chatRoomId = chatRoom.chatRoomId',
        {
          'lastMessage.chatMessageId': 'DESC',
        },
      )
      .orderBy('lastMessage.createdAt', 'DESC', 'NULLS LAST')
      .getMany();

    return await Promise.all(
      customerChatRooms.map((room) => room.chatRoom),
    ).then((rooms) => {
      return rooms.map((room) => toDto(ChatRoomDto, room));
    });
  }

  async findChatRoom(
    customerId: number,
    chatRoomId: number,
  ): Promise<CustomerChatRoom> {
    return await this.customerChatRoomRepository.findOne({
      where: { customerId, chatRoomId },
    });
  }

  async createChatRoom(dto: ChatRoomDto): Promise<ChatRoomDto> {
    const newRoom = this.customerChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      customerId: dto.inviteUser.userId,
    });

    const customer = await this.customerService.findOne({
      userId: dto.inviteUser.userId,
    });

    if (!customer) {
      throw new NotFoundException(
        `InvitUser(${dto.inviteUser.userId} not found `,
      );
    }

    return await this.customerChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Customer Chat room created: ${room.chatRoomId}`);
      return toDto(ChatRoomDto, room.chatRoom);
    });
  }
}
