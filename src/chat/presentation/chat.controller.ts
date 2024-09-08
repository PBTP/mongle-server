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
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { Customer } from '../../schemas/customers.entity';
import { CrudGroup } from '../../common/validation/validation.data';
import { GroupValidation } from '../../common/validation/validation.decorator';
import { CursorDto } from '../../common/dto/cursor.dto';
import { ChatMessageDto, ChatRoomDto } from './chat.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('채팅방 API')
@Controller('v1/chat/room')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: '채팅방 생성',
    description:
      '채팅방을 생성합니다. customer, driver, business 모두 사용 가능하도록 설계되었으며\n' +
      ' 이를 통칭 User라고 지칭합니다',
  })
  @ApiCreatedResponse({
    description: '채팅방 생성 성공',
    type: ChatRoomDto,
  })
  @Auth(HttpStatus.CREATED)
  @Post()
  @GroupValidation([CrudGroup.create])
  async createChat(
    @Body() chatRoom: ChatRoomDto,
    @CurrentCustomer() customer: Customer,
  ): Promise<ChatRoomDto> {
    return await this.chatService.createChatRoom(chatRoom, customer);
  }

  @ApiOperation({
    summary: '채팅방 목록 조회',
    description:
      '현재 유저의 채팅방 목록을 조회합니다.' +
      '정렬 기준은 마지막 메시지의 시간의 최신순으로 정렬됩니다.' +
      '현재는 customer 만 조회 가능합니다.',
  })
  @ApiOkResponse({
    description: '채팅방 목록 조회 성공',
    type: [ChatRoomDto],
  })
  @Auth()
  @Get()
  async findChatRooms(
    @CurrentCustomer() customer: Customer,
  ): Promise<ChatRoomDto[]> {
    return await this.chatService.findChatRooms({
      userId: customer.customerId,
      userType: 'customer',
    });
  }

  @ApiOperation({
    summary: '채팅방 메시지 조회',
    description:
      '채팅방의 메시지를 조회합니다.\n' +
      '해당 페이지는 커서 기반 페이징으로 구현되어 있습니다.\n' +
      '따라서 이전 페이지의 마지막 메시지를 기준으로 다음 페이지를 조회합니다.\n' +
      '커서가 없을 경우 최신 메시지를 기준으로 조회합니다.',
  })
  @ApiOkResponse({
    description: '채팅방 메시지 조회 성공',
    type: CursorDto<ChatMessageDto>,
  })
  @Auth()
  @Get(':chatRoomId/message')
  async findMessages(
    @Param('chatRoomId') chatRoomId: number,
    @Query() cursor: CursorDto<ChatMessageDto>,
    @CurrentCustomer() customer: Customer,
  ): Promise<CursorDto<ChatMessageDto>> {
    return await this.chatService.findMessages(chatRoomId, cursor, customer);
  }
}
