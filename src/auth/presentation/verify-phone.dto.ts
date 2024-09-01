import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    description: '암호화된 전화번호',
    required: true,
    type: String,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: '인증코드',
    type: String,
    example: '123456',
  })
  verificationCode: string;
}
