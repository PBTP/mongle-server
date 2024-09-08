import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CrudGroup } from '../../common/validation/validation.data';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  authProvider?: AuthProvider;

  @ApiProperty({
    description: '사용자가 고객인지, 기사인지, 업체인지 확인하는 타입입니다.',
    required: true,
  })
  @IsIn(['customer', 'driver', 'business'], { groups: [UserGroup.login] })
  @IsOptional()
  @IsNotEmpty({ groups: [UserGroup.login] })
  userType?: UserType;

  @ApiProperty({
    description:
      '사용자 ID입니다 userType에 따라 customerId, driverId, businessId로 될 수 있으며 UserDto에선 userId로 통일합니다.',
    required: false,
  })
  @IsNotEmpty({ groups: [CrudGroup.create] })
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description:
      '사용자 전화번호입니다. 현재는 customer, business에서만 사용합니다.',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: '사용자 UUID입니다.',
    required: false,
  })
  uuid?: string;

  @ApiProperty({
    description: '사용자 이름입니다.',
  })
  name?: string;
}
