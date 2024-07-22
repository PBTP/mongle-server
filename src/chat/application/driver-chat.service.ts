import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomDto } from '../presentation/chat-room.dto';
import { DriverChatRoom } from '../../schemas/driver-chat-room.entity';
import { IChatService } from './chat.interface';
import { UserDto } from '../../auth/presentation/user.dto';
import { DriverService } from '../../driver/application/driver.service';
import { plainToInstance as toDto } from 'class-transformer';

@Injectable()
export class DriverChatService implements IChatService {
  private readonly logger = new Logger(DriverChatService.name);

  constructor(
    @InjectRepository(DriverChatRoom)
    private readonly driverChatRoomRepository: Repository<DriverChatRoom>,
    private readonly driverService: DriverService,
  ) {}

  async findChatRooms(user: UserDto): Promise<ChatRoomDto[]> {
    const driverChatRooms = await this.driverChatRoomRepository.find({
      where: { driverId: user.userId },
    });

    return await Promise.all(driverChatRooms.map((room) => room.chatRoom)).then(
      (rooms) => {
        return rooms.map((room) => {
          return toDto(ChatRoomDto, room);
        });
      },
    );
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
