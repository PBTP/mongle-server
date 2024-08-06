import { IsOptional, Length } from 'class-validator';
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
    description: '고객 위치 경도',
    nullable: true,
    required: false,
    type: Number,
  })
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: '고객 위치 위도',
    nullable: true,
    required: false,
    type: Number,
  })
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: '고객 상세 주소',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 100)
  customerAddress?: string;
}
