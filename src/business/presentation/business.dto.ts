import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Length, ValidateIf } from 'class-validator';
import { Point } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TAuthDto } from '../../auth/presentation/auth.dto';
import { AuthProvider, UserGroup } from '../../auth/presentation/user.dto';
import { CRUD } from '../../common/validation/validation.data';

export type TBusinessDto = TAuthDto & {
  businessId?: number;
  uuid: string;
  businessName: string;
  businessPhoneNumber?: string;
  businessLocation?: Point;
  businessPriceGuide?: string;
  businessRule?: string;
  openingDate?: Date;
  authProvider: AuthProvider;
};

export class BusinessDto implements TBusinessDto {
  @ApiProperty({
    description: 'Mongle Server에서의 업체 식별자',
    required: false,
    readOnly: true,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => !o.uuid, { groups: CRUD })
  businessId?: number;

  @ApiProperty({
    description: 'ResourceServer에서 제공한 업체 식별자',
    required: true,
    type: String,
  })
  @Length(1, 44, { groups: CRUD })
  @IsNotEmpty({ groups: CRUD })
  @IsOptional()
  @ValidateIf((o) => !o.businessId, { groups: CRUD })
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
  @IsOptional()
  @IsEnum(AuthProvider, { groups: [UserGroup.login] })
  authProvider: AuthProvider;
}
