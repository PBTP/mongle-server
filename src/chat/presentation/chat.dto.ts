import { UserDto } from '../../auth/presentation/user.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MessageType } from '../../schemas/chat-message.entity';
import { Group, RUD } from '../../common/validation/validation.data';

export class ChatRoomDto {
  @IsNotEmpty({ groups: RUD })
  @ValidateIf((o) => !o.tsid || o.chatRoomId, { groups: RUD })
  @IsOptional()
  public chatRoomId: number;

  @IsNotEmpty({ groups: RUD })
  @ValidateIf((o) => o.tsid || !o.chatRoomId, { groups: RUD })
  @IsOptional()
  public tsid: string;

  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  public chatRoomName: string;

  @IsNotEmpty({ groups: [Group.create] })
  @ValidateNested({ groups: [Group.create] })
  @IsOptional()
  public inviteUser?: UserDto;
  public createdAt: Date;

  public lastMessage?: ChatMessageDto;
}

export class ChatMessageDto {
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: number;

  chatMessageId: number;

  senderUuid: string;

  @IsEnum(MessageType)
  @IsNotEmpty()
  chatMessageType: MessageType;

  @IsNotEmpty()
  user: UserDto;

  @IsString()
  @IsNotEmpty()
  chatMessageContent: string;
}
