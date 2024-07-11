import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from '../application/chat.service';
import { ChatRoomDto } from './chat-room.dto';
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { Customer } from '../../schemas/customers.entity';
import { Group } from '../../common/validation/validation.data';
import { GroupValidation } from '../../common/validation/validation.decorator';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth()
  @Post()
  @GroupValidation([Group.create])
  async createChat(
    @Body() chatRoom: ChatRoomDto,
    @CurrentCustomer() customer: Customer,
  ) {
    return await this.chatService.createChatRoom(chatRoom, customer);
  }
}
