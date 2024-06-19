import { ApiProperty } from '@nestjs/swagger';

export class VerifyPhoneDto {
  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
    type: String,
  })
  phoneNumber: string;

  @ApiProperty({
    description: '인증코드',
    example: '123456',
    type: String,
  })
  verificationCode: string;
}
