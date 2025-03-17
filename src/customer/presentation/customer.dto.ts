import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Point } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { AuthProvider } from '../../auth/presentation/user.dto';
import { PresignedUrlDto } from '../../common/cloud/aws/s3/presentation/presigned-url.dto';
import { Expose } from 'class-transformer';

type CustomerType = {
  get uuid(): string | undefined;
  set uuid(value: string);

  get customerName(): string;
  set customerName(value: string);

  get customerPhoneNumber(): string | undefined;
  set customerPhoneNumber(value: string);

  get customerLocation(): Point | undefined;
  set customerLocation(value: Point);

  get customerAddress(): string | undefined;
  set customerAddress(value: string);

  get customerDetailAddress(): string | undefined;
  set customerDetailAddress(value: string);

  get authProvider(): AuthProvider;
  set authProvider(value: AuthProvider);

  get profileImageUrl(): string | undefined;
  set profileImageUrl(value: string);

  get presignedUrlDto(): PresignedUrlDto | undefined;
  set presignedUrlDto(value: PresignedUrlDto);
};

export class BaseCustomerDto extends AuthDto implements CustomerType {
  @ApiProperty({
    description: 'ResourceServer에서 제공한 유저 식별자',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 44)
  protected override _uuid?: string;

  @ApiProperty({
    description: '고객 이름',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 30)
  protected _customerName: string;

  @ApiProperty({
    description: '고객 전화번호',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 30)
  @Matches(/^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/, {
    message: 'This is not Phone number ex) xxx-xxxx-xxxx',
  })
  protected _customerPhoneNumber?: string;

  @ApiProperty({
    description: '고객 위치',
    nullable: true,
    required: false,
  })
  @IsOptional()
  protected _customerLocation?: Point;

  @ApiProperty({
    description: '고객 위치 주소',
    nullable: true,
    required: false,
  })
  @IsOptional()
  protected _customerAddress?: string;

  @ApiProperty({
    description: '고객 위치 상세주소',
    nullable: true,
    required: false,
  })
  @IsOptional()
  protected _customerDetailAddress?: string;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  protected override _authProvider: AuthProvider;

  @ApiProperty({
    description: '프로필 이미지 URL',
  })
  protected _profileImageUrl?: string;

  @ApiProperty({
    description: '프로필 이미지 업데이트용 DTO',
  })
  @ValidateNested()
  protected _presignedUrlDto?: PresignedUrlDto;

  @Expose()
  override get uuid(): string | undefined {
    return this._uuid;
  }

  override set uuid(value: string) {
    super.uuid = value;
  }

  @Expose()
  get customerName(): string {
    return this._customerName;
  }
  set customerName(value: string) {
    this._customerName = value;
  }

  @Expose()
  get customerPhoneNumber(): string | undefined {
    return this._customerPhoneNumber;
  }
  set customerPhoneNumber(value: string | undefined) {
    this._customerPhoneNumber = value;
  }


  @Expose()
  get customerLocation(): Point | undefined {
    return this._customerLocation;
  }
  set customerLocation(value: Point) {
    this._customerLocation = value;
  }

  @Expose()
  get customerAddress(): string | undefined {
    return this._customerAddress;
  }
  set customerAddress(value: string) {
    this._customerAddress = value;
  }

  @Expose()
  get customerDetailAddress(): string | undefined {
    return this._customerDetailAddress;
  }
  set customerDetailAddress(value: string) {
    this._customerDetailAddress = value;
  }

  @Expose()
  override get authProvider(): AuthProvider {
    return this._authProvider;
  }
  override set authProvider(value: AuthProvider) {
    this._authProvider = value;
  }

  @Expose()
  get profileImageUrl(): string | undefined {
    return this._profileImageUrl;
  }
  set profileImageUrl(value: string) {
    this._profileImageUrl = value;
  }

  @Expose()
  get presignedUrlDto(): PresignedUrlDto | undefined {
    return this._presignedUrlDto;
  }
  set presignedUrlDto(value: PresignedUrlDto) {
    this._presignedUrlDto = value;
  }
}

export class CreateCustomerDto extends BaseCustomerDto { }

export class CustomerDto extends BaseCustomerDto {
  @ApiProperty({
    description: 'Mongle Server에서의 고객 식별자',
    required: false,
    readOnly: true,
  })
  @IsNumber()
  @IsOptional()
  protected override _customerId: number;

  @Expose()
  override get customerId(): number {
    return this._customerId;
  }
  override set customerId(value: number) {
    this._customerId = value;
  }
}
