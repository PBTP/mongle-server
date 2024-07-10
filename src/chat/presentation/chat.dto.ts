import { UserDto } from '../../auth/presentation/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  public roomId: string;
  public uuid: string;
}

export class MessageDto extends ChatDto {
  @IsString()
  @IsNotEmpty()
  public message: string;
  public user: UserDto;
}
