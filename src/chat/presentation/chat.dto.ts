import { UserDto } from '../../auth/presentation/user.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MessageType } from '../../schemas/chat-message.entity';

export class ChatDto {
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: number;
  uuid: string;
}

export class MessageDto extends ChatDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsNotEmpty()
  chatMessageType: MessageType;

  user: UserDto;
}
