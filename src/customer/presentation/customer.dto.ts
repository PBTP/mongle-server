import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Length, Matches, ValidateNested } from "class-validator";
import { Point } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { AuthDto } from "../../auth/presentation/auth.dto";
import { AuthProvider } from "../../auth/presentation/user.dto";
import { PresignedUrlDto } from "../../common/cloud/aws/s3/presentation/presigned-url.dto";

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
  @Matches(/^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/, {
    message: 'This is not Phone number ex) xxx-xxxx-xxxx',
  })
  customerPhoneNumber?: string;

  @ApiProperty({
    description: '고객 위치',
    nullable: true,
    required: false,
  })
  @IsOptional()
  customerLocation?: Point;

  @ApiProperty({
    description: '고객 위치 주소',
    nullable: true,
    required: false,
  })
  @IsOptional()
  customerAddress?: string;

  @ApiProperty({
    description: '고객 위치 상세주소',
    nullable: true,
    required: false,
  })
  @IsOptional()
  customerDetailAddress?: string;

  @ApiProperty({
    description: '인증 제공자 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;

  @ApiProperty({
    description: '프로필 이미지 URL',
  })
  profileImageUrl?: string;

  @ApiProperty({
    description: '프로필 이미지 업데이트용 DTO',
  })
  @ValidateNested()
  presignedUrlDto?: PresignedUrlDto;
}
