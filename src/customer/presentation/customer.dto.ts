import { IsNotEmpty, IsOptional, IsEnum, Length } from 'class-validator';
import { Point } from 'typeorm';
import { AuthProvider } from '../entities/customer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CustomerDto {
  @ApiProperty({
    description: 'Mongle Server에서의 고객 식별자',
    required: true,
    type: String,
  })
  customerId: number;

  @ApiProperty({
    description: 'ResourceServer에서 제공한 유저 식별자',
    required: true,
    type: String,
  })
  @Expose()
  @IsNotEmpty()
  @Length(1, 20)
  uuid: string;

  @ApiProperty({
    description: '고객 이름',
    required: true,
    type: String,
  })
  @Expose()
  @IsNotEmpty()
  @Length(1, 30)
  customerName: string;

  @ApiProperty({
    description: '고객 전화번호',
    nullable: true,
    required: false,
    type: String,
  })
  @Expose()
  @IsOptional()
  @Length(1, 30)
  customerPhoneNumber: string;

  @ApiProperty({
    description: '고객 위치',
    nullable: true,
    required: false,
  })
  @Expose()
  @IsOptional()
  customerLocation: Point;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  @Exclude({ toPlainOnly: true })
  authProvider: AuthProvider;

  @IsOptional()
  @Exclude({ toPlainOnly: true })
  refreshToken: string;
}
