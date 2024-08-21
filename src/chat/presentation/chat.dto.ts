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
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: '채팅방 ID 입니다.',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: number;

  @ApiProperty({
    description: '채팅 메시지 ID 입니다.',
    nullable: false,
  })
  chatMessageId: number;

  @ApiProperty({
    description: '채팅 메시지를 보낸 User의 UUID 입니다.',
    readOnly: true,
    required: true,
    nullable: false,
  })
  senderUuid: string;

  @ApiProperty({
    description:
      '채팅 메시지 타입 입니다.\n' +
      ' TEXT: 텍스트 메시지\n' +
      ' IMAGE: 이미지 메시지\n' +
      ' VIDEO: 비디오 메시지',
    required: true,
    nullable: false,
  })
  @IsEnum(MessageType)
  @IsNotEmpty()
  chatMessageType: MessageType;

  @ApiProperty({
    description: '메시지를 보낸 유저의 정보입니다.',
    readOnly: true,
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  user: UserDto;

  @ApiProperty({
    description: '채팅 메시지 내용입니다.',
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  chatMessageContent: string;
}

export class ChatRoomDto {
  @ApiProperty({
    description:
      '채팅방 ID 입니다. 채팅방 ID가 없을 경우 tsid를 사용합니다.\n' +
      ' 채팅방 ID와 tsid 중 하나는 필수로 입력해야 합니다.\n' +
      '읽기, 업데이트, 삭제시에 사용됩니다.',
    required: false,
    nullable: false,
    type: String,
  })
  @IsNotEmpty({ groups: RUD })
  @ValidateIf((o) => !o.tsid || o.chatRoomId, { groups: RUD })
  @IsNumber()
  @IsOptional()
  public chatRoomId: number;

  @ApiProperty({
    description:
      '채팅방 tsid 입니다. 채팅방 tsid가 없을 경우 chatRoomId를 사용합니다.\n' +
      ' 채팅방 ID와 tsid 중 하나는 필수로 입력해야 합니다.' +
      '읽기, 업데이트, 삭제시에 사용됩니다.',
    required: false,
    nullable: false,
    type: String,
  })
  @IsNotEmpty({ groups: RUD })
  @ValidateIf((o) => o.tsid || !o.chatRoomId, { groups: RUD })
  @IsString()
  @IsOptional()
  public tsid: string;

  @ApiProperty({
    description:
      '채팅방 이름입니다. 채팅방 생성시 이름은 필수로 입력해야 합니다.',
    required: true,
    nullable: false,
    type: String,
  })
  @IsNotEmpty({ groups: [Group.create] })
  @IsString()
  @IsOptional()
  public chatRoomName: string;

  @ApiProperty({
    description:
      '채팅방에 초대할 유저 입니다. 채팅방 생성시 필수로 입력해야 합니다.',
    required: false,
    type: UserDto,
  })
  @IsNotEmpty({ groups: [Group.create] })
  @ValidateNested({ groups: [Group.create] })
  @IsOptional()
  public inviteUser: UserDto;

  public createdAt: Date;

  @ApiProperty({
    description: '채팅방 마지막 메시지 입니다.',
    readOnly: true,
    required: false,
    nullable: true,
    type: ChatMessageDto,
  })
  public lastMessage?: ChatMessageDto;
}
