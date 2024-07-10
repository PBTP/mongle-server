import { UserDto } from '../../auth/presentation/user.dto';

export class ChatDto {
  public roomId: string;
  public uuid: string;
}

export class MessageDto extends ChatDto {
  public message: string;
  public user: UserDto;
}
