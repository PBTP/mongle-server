import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    description: '전화번호',
    required: true,
    type: String,
    example: '01012345678',
  })
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty({
    description: '인증코드',
    type: String,
    example: '123456',
  })
  verificationCode: string;
}
