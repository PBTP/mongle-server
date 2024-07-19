import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from '../../schemas/chat-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from '../../schemas/chat-message.entity';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { CustomerChatService } from './customer-chat.service';
import { DriverChatService } from './driver-chat.service';
import { BusinessChatService } from './business-chat.service';
import { ChatMessageDto, MessageDto } from '../presentation/chat.dto';
import { UserDto } from '../../auth/presentation/user.dto';
import { UserSocket } from '../presentation/chat.gateway';
import { CacheService } from '../../common/cache/cache.service';
import { Customer } from '../../schemas/customers.entity';
import { Driver } from '../../schemas/drivers.entity';
import { CursorDto } from '../../common/dto/cursor.dto';
import { Business } from '../../schemas/business.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly roomServices = {};

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    private readonly cacheService: CacheService,
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

  async exists(chatRoom: Partial<ChatRoom>): Promise<boolean> {
    const where = {};

    chatRoom.chatRoomId && (where['chatRoomId'] = chatRoom.chatRoomId);
    chatRoom.tsid && (where['tsid'] = chatRoom.tsid);

    return this.chatRepository.exists({
      where,
    });
  }

  async findOne(chatRoom: Partial<ChatRoom>): Promise<ChatRoom> {
    const where = {};

    chatRoom.chatRoomId && (where['chatRoomId'] = chatRoom.chatRoomId);
    chatRoom.tsid && (where['tsid'] = chatRoom.tsid);

    return await this.chatRepository.findOne({ where });
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

  async saveMessage(message: MessageDto): Promise<ChatMessage> {
    const lastMessage = await this.chatMessageRepository.find({
      where: { chatRoomId: message.chatRoomId },
      order: { chatMessageId: 'DESC' },
      take: 1,
    });

    const lastMessageId: number = lastMessage[0]?.chatMessageId ?? 0;

    return await this.chatMessageRepository.save(
      this.chatMessageRepository.create({
        chatMessageId: lastMessageId + 1,
        chatRoomId: message.chatRoomId,
        senderUuid: message.user.uuid,
        chatMessageType: message.chatMessageType,
        chatMessageContent: message.content,
      }),
    );
  }

  async getMessage(
    chatRoomId: number,
    cursor: CursorDto<ChatMessageDto>,
    customer: Customer,
  ): Promise<CursorDto<ChatMessageDto>> {
    const chatRoom = await this.customerChatService.findChatRoom(
      customer.customerId,
      chatRoomId,
    );

    if (!chatRoom) {
      throw new ForbiddenException('Your not allowed to access this room');
    }

    let query = this.chatMessageRepository
      .createQueryBuilder('CM')
      .leftJoinAndSelect('CM.chatRoom', 'chatRoom')
      .leftJoinAndMapOne(
        'CM.customer',
        Customer,
        'customer',
        'CM.senderUuid = customer.uuid',
      )
      .leftJoinAndMapOne(
        'CM.driver',
        Driver,
        'driver',
        'CM.senderUuid = driver.uuid',
      )
      .leftJoinAndMapOne(
        'CM.business',
        Business,
        'business',
        'CM.senderUuid = business.uuid',
      )
      .where('CM.chatRoomId = :chatRoomId', { chatRoomId });

    if (cursor.cursor) {
      query = query.andWhere('CM.chatMessageId <= :cursor', {
        cursor: cursor.cursor,
      });
    }

    const chatMessages = await query
      .orderBy('CM.chatMessageId', 'DESC')
      .take(cursor.limit)
      .getMany();

    return {
      data: chatMessages.map((message) => {
        const userType = message['customer']
          ? 'customer'
          : message['driver']
            ? 'driver'
            : 'business';

        const user = message[userType];

        return {
          chatRoomId: message.chatRoomId,
          chatMessageId: message.chatMessageId,
          senderUuid: message.senderUuid,
          chatMessageType: message.chatMessageType,
          chatMessageContent: message.chatMessageContent,
          user: {
            uuid: user.uuid,
            userId: user[userType + 'Id'],
            userType,
            userName: user[userType + 'Name'],
          },
        };
      }),
      next: chatMessages[chatMessages.length - 1]?.chatMessageId - 1 ?? 0,
    };
  }

  // Socket Service
  // 'join' message action
  async join(client: UserSocket, chatRoomId: string): Promise<void> {
    this.joinRoom(chatRoomId, client.user)
      .then(() => {
        return this.cacheService.sadd(
          `chat:user:${client.user.uuid}:rooms`,
          chatRoomId,
        );
      })
      .then(() => {
        !client.rooms.has(chatRoomId) && client.join(chatRoomId);
        this.logger.log(`Client ${client.user.uuid} join room ${chatRoomId}`);
      });
  }

  async joinRoom(chatRoomId: string, user: UserDto): Promise<boolean> {
    await this.cacheService.sadd(`chat:room:${chatRoomId}:users`, user);
    return true;
  }

  // 'exit' message action
  async exit(client: UserSocket): Promise<void> {
    // 인증실패시 로직 진행 X
    if (!client.user) {
      this.logger.debug('Client not authenticated');
      return;
    }

    this.getUserChatRoomIds(client)
      .then(async (chatRoomIds) => {
        for (const chatRoomId of chatRoomIds) {
          await this.exitRoom(chatRoomId, client.user);
        }
        return chatRoomIds;
      })
      .then((chatRoomIds) => {
        this.cacheService
          .del(`chat:user:${client.user.uuid}:rooms`)
          .then(() => {
            for (const chatRoomId of chatRoomIds) {
              client.leave(chatRoomId);
            }
          });
      });
  }

  async exitRoom(chatRoomId: string, user: UserDto): Promise<boolean> {
    await this.cacheService
      .srem(`chat:room:${chatRoomId}:users`, user)
      .then((v) => this.logger.debug('Remove user count', v));
    return true;
  }

  async getUserChatRoomIds(client: UserSocket): Promise<string[]> {
    return await this.cacheService
      .smembers(`chat:user:${client.user.uuid}:rooms`)
      .then((v) => {
        return v ?? [];
      });
  }

  async getRoomUsers(chatRoomId: number): Promise<UserDto[]> {
    return await this.cacheService
      .smembersData<UserDto>(`chat:room:${chatRoomId}:users`)
      .then((v) => {
        return v ?? [];
      });
  }
}
