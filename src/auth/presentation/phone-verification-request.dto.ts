import { ApiProperty } from '@nestjs/swagger';

export class PhoneVerificationRequestDto {
  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
    type: String,
  })
  phoneNumber: string;
}
