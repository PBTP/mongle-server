import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  IsNumber,
} from 'class-validator';
import { Point } from 'typeorm';
;
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { AuthProvider } from "../../auth/presentation/user.dto";

export class BusinessDto extends AuthDto {
  @ApiProperty({
    description: 'Mongle Server에서의 업체 식별자',
    required: false,
    readOnly: true,
  })
  @IsNumber()
  @IsOptional()
  businessId?: number;

  @ApiProperty({
    description: 'ResourceServer에서 제공한 업체 식별자',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 44)
  uuid: string;

  @ApiProperty({
    description: '업체 이름',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 30)
  businessName: string;

  @ApiProperty({
    description: '업체 전화번호',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 30)
  businessPhoneNumber?: string;

  @ApiProperty({
    description: '업체 위치',
    nullable: true,
    required: false,
  })
  @IsOptional()
  businessLocation?: Point;

  @ApiProperty({
    description: '업체 가격 가이드',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 30)
  businessPriceGuide: string;

  @ApiProperty({
    description: '업체 규칙',
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(1, 30)
  businessRule: string;

  @ApiProperty({
    description: '업체 오픈일',
    nullable: true,
    required: false,
  })
  @IsOptional()
  openingDate: Date;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;
}
