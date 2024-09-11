import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BusinessChatRoom } from "../../schemas/business-chat-room.entity";
import { IChatService } from "./chat.interface";
import { UserDto } from "../../auth/presentation/user.dto";
import { ChatRoomDto } from "../presentation/chat.dto";
import { toDto } from "../../common/function/util.function";

@Injectable()
export class BusinessChatService implements IChatService {
  private readonly logger = new Logger(BusinessChatService.name);

  constructor(
    @InjectRepository(BusinessChatRoom)
    private readonly businessChatRoomRepository: Repository<BusinessChatRoom>,
  ) {}

  async exitsUserRoom(user: UserDto, chatRoomId: number): Promise<boolean> {
    return await this.businessChatRoomRepository.exists({
      where: { businessId: user.userId, chatRoomId },
    });
  }

  async findChatRooms(user: UserDto): Promise<ChatRoomDto[]> {
    const businessChatRooms = await this.businessChatRoomRepository.find({
      where: { businessId: user.userId },
    });

    return await Promise.all(
      businessChatRooms.map((room) => room.chatRoom),
    ).then((rooms) => {
      return rooms.map((room) => {
        return toDto(ChatRoomDto, room);
      });
    });
  }

  async getChatRoomById(
    businessId: number,
    chatRoomId: number,
  ): Promise<BusinessChatRoom> {
    return await this.businessChatRoomRepository.findOne({
      where: { businessId, chatRoomId },
    });
  }

  async createChatRoom(dto: ChatRoomDto): Promise<ChatRoomDto> {
    const newRoom = this.businessChatRoomRepository.create({
      chatRoomId: dto.chatRoomId,
      businessId: dto.inviteUser.userId,
    });

    return await this.businessChatRoomRepository.save(newRoom).then((room) => {
      this.logger.log(`Business Chat room created: ${room.chatRoomId}`);
      return toDto(ChatRoomDto, room.chatRoom);
    });
  }
}
