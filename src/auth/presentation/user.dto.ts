import { IsNotEmpty, IsOptional } from 'class-validator';
import { Group } from '../../common/validation/validation.data';

export class UserDto {
  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  userType?: UserType;

  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  userId?: number;
  uuid?: string;
  name?: string;
}

// 고객, 업체, 기사 공통 사용 DTO
export type UserType = 'customer' | 'driver' | 'business';
