import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DriverChatRoom } from "../../schemas/driver-chat-room.entity";
import { IChatService } from "./chat.interface";
import { UserDto } from "../../auth/presentation/user.dto";
import { DriverService } from "../../driver/application/driver.service";
import { ChatRoomDto } from "../presentation/chat.dto";
import { toDto } from "../../common/function/util.function";

@Injectable()
export class DriverChatService implements IChatService {
  private readonly logger = new Logger(DriverChatService.name);

  constructor(
    @InjectRepository(DriverChatRoom)
    private readonly driverChatRoomRepository: Repository<DriverChatRoom>,
    private readonly driverService: DriverService,
  ) {}

  async exitsUserRoom(user: UserDto, chatRoomId: number): Promise<boolean> {
    return await this.driverChatRoomRepository.exists({
      where: { driverId: user.userId, chatRoomId },
    });
  }

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

  async createChatRoom(dto: ChatRoomDto): Promise<ChatRoomDto> {
    const newRoom = this.driverChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      driverId: dto.inviteUser.userId,
    });

    return await this.driverChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Driver Chat room created: ${room.chatRoomId}`);
      return toDto(ChatRoomDto, room);
    });
  }
}
