import { IsNotEmpty, IsOptional } from 'class-validator';
import { Group } from '../../common/validation/validation.data';

export enum AuthProvider {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
  BASIC = 'BASIC',
}

export class UserDto {
  authProvider?: AuthProvider;

  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  userType?: UserType;

  @IsNotEmpty({ groups: [Group.create] })
  @IsOptional()
  userId?: number;
  phoneNumber?: string;
  uuid?: string;
  name?: string;
}

// 고객, 업체, 기사 공통 사용 DTO
export type UserType = 'customer' | 'driver' | 'business';
