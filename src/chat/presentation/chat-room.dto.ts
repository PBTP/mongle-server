import {
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RUD, Group } from '../../common/validation/validation.data';
import { UserDto } from '../../auth/presentation/user.dto';

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

  public users?: UserDto[] = [];
}
