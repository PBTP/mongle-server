import { IsOptional, Length } from 'class-validator';
import { Point } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: '고객 이름',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
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
}
