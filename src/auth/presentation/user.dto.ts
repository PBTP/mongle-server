import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CrudGroup } from '../../common/validation/validation.data';

// 고객, 업체, 기사 공통 사용 DTO
export type UserType = 'customer' | 'driver' | 'business';

// UserDtoValidationGroup
export enum UserGroup {
  login = 'login',
}

export enum AuthProvider {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
  BASIC = 'BASIC',
}

export class UserDto {
  authProvider?: AuthProvider;

  @IsIn(['customer', 'driver', 'business'], { groups: [UserGroup.login] })
  @IsOptional()
  @IsNotEmpty({ groups: [UserGroup.login] })
  userType?: UserType;

  @IsNotEmpty({ groups: [CrudGroup.create] })
  @IsOptional()
  userId?: number;
  phoneNumber?: string;
  uuid?: string;
  name?: string;
}
