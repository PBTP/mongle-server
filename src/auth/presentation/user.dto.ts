import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CrudGroup } from '../../common/validation/validation.data';
import { Customer } from '../../customer/customer.domain';
import { Expose } from "class-transformer";

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
  protected _authProvider?: AuthProvider;

  @ApiProperty({
    description: '사용자가 고객인지, 기사인지, 업체인지 확인하는 타입입니다.',
    required: true,
  })
  @IsIn(['customer', 'driver', 'business'], { groups: [UserGroup.login] })
  @IsOptional()
  @IsNotEmpty({ groups: [UserGroup.login] })
  protected _userType?: UserType;

  @ApiProperty({
    description:
      '사용자 ID입니다 userType에 따라 customerId, driverId, businessId로 될 수 있으며 UserDto에선 userId로 통일합니다.',
    required: false,
  })
  @IsNotEmpty({ groups: [CrudGroup.create] })
  @IsOptional()
  protected _userId?: number;

  @ApiProperty({
    description:
      '사용자 전화번호입니다. 현재는 customer, business에서만 사용합니다.',
    required: false,
  })
  protected _phoneNumber?: string;

  @ApiProperty({
    description: '사용자 UUID입니다.',
    required: false,
  })
  protected _uuid?: string;

  @ApiProperty({
    description: '사용자 이름입니다.',
  })
  protected _name?: string;

  protected _customerId?: number;
  protected _driverId?: number;
  protected _businessId?: number;

  @Expose()
  get authProvider(): AuthProvider | undefined {
    return this._authProvider;
  }

  set authProvider(value: AuthProvider) {
    this._authProvider = value;
  }

  @Expose()
  get userType(): UserType | undefined {
    return this._userType;
  }

  set userType(value: UserType) {
    this._userType = value;
  }

  @Expose()
  get userId(): number | undefined {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  @Expose()
  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  set phoneNumber(value: string | undefined) {
    this._phoneNumber = value;
  }

  @Expose()
  get uuid(): string | undefined {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
  }

  @Expose()
  get name(): string | undefined {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  @Expose()
  get customerId(): number | undefined {
    return this._customerId;
  }

  set customerId(value: number) {
    this._customerId = value;
  }

  @Expose()
  get driverId(): number | undefined {
    return this._driverId;
  }

  set driverId(value: number) {
    this._driverId = value;
  }

  @Expose()
  get businessId(): number | undefined {
    return this._businessId;
  }

  set businessId(value: number) {
    this._businessId = value;
  }

  static from(customer: Customer): UserDto {
    return Builder(UserDto)
      .userId(customer.customerId)
      .name(customer.customerName)
      .phoneNumber(customer.customerPhoneNumber)
      .authProvider(customer.authProvider)
      .uuid(customer.uuid)
      .build();
  }
}
