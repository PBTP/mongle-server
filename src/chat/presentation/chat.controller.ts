import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from '../application/chat.service';
import { ChatRoomDto } from './chat-room.dto';
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { Customer } from '../../schemas/customers.entity';
import { Group } from '../../common/validation/validation.data';
import { GroupValidation } from '../../common/validation/validation.decorator';
import { CursorDto } from '../../common/dto/cursor.dto';
import { ChatMessageDto } from './chat.dto';

@Controller('v1/chat/room')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth(HttpStatus.CREATED)
  @Post()
  @GroupValidation([Group.create])
  async createChat(
    @Body() chatRoom: ChatRoomDto,
    @CurrentCustomer() customer: Customer,
  ) {
    return await this.chatService.createChatRoom(chatRoom, customer);
  }

  @Auth()
  @Get(':chatRoomId/message')
  async getMessage(
    @Param('chatRoomId')
    chatRoomId: number,
    @Query() cursor: CursorDto<ChatMessageDto>,
    @CurrentCustomer() customer: Customer,
  ) {
    return await this.chatService.getMessage(chatRoomId, cursor, customer);
  }
}
