import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { RUD, Group } from '../../common/validation/validation.data';

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
  @IsOptional()
  public inviteUserType: UserType;

  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  public inviteUserId: number;

  public createdAt: Date;
}

export type UserType = 'customer' | 'driver' | 'business';
