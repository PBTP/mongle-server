import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerChatRoom } from '../../schemas/customer-chat-room.entity';
import { Repository } from 'typeorm';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { IChatService } from './chat.interface';
import { CustomerService } from '../../customer/application/customer.service';
import { UserDto } from '../../auth/presentation/user.dto';
import { plainToInstance as toDto } from 'class-transformer';

@Injectable()
export class CustomerChatService implements IChatService {
  private readonly logger = new Logger(CustomerChatService.name);
  constructor(
    @InjectRepository(CustomerChatRoom)
    private readonly customerChatRoomRepository: Repository<CustomerChatRoom>,
    private readonly customerService: CustomerService,
  ) {}

  async findChatRooms(user: UserDto): Promise<ChatRoomDto[]> {
    const customerChatRooms = await this.customerChatRoomRepository.find({
      where: { customerId: user.userId },
    });

    return await Promise.all(
      customerChatRooms.map((room) => room.chatRoom),
    ).then((rooms) => {
      return rooms.map((room) => {
        return toDto(ChatRoomDto, room);
      });
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

  async createChatRoom(dto: ChatRoomDto): Promise<CustomerChatRoom> {
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
      return room;
    });
  }
}
