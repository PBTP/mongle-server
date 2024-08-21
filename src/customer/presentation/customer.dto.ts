import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  IsNumber,
} from 'class-validator';
import { AuthProvider } from '../../schemas/customers.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({
    description: 'Mongle Server에서의 고객 식별자',
    required: false,
    readOnly: true,
  })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({
    description: 'ResourceServer에서 제공한 유저 식별자',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 44)
  uuid: string;

  @ApiProperty({
    description: '고객 이름',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 30)
  customerName: string;

  @ApiProperty({
    description: '고객 전화번호',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 30)
  customerPhoneNumber?: string;

  @ApiProperty({
    description: '고객 위치',
    nullable: true,
    required: false,
  })
  @IsOptional()
  customerLocation?: string;

  @ApiProperty({
    description: '고객 상세 주소',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  customerAddress?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;

  @IsOptional()
  refreshToken?: string;
}
