import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  IsNumber,
} from 'class-validator';
import { Point } from 'typeorm';
import { AuthProvider } from '../../schemas/customers.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '../../auth/presentation/auth.dto';

export class CustomerDto extends AuthDto {
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
  @Length(1, 20)
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
  customerLocation?: Point;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;
}
