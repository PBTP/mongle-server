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
    description: '고객 위치',
    nullable: true,
    required: false,
    type: String,
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
}
