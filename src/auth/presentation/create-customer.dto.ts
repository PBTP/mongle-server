import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from 'src/schemas/customers.entity';

export class CreateCustomerDto {
  @ApiProperty({
    description: '유저 식별자',
    required: true,
    type: String,
  })
  uuid: string;

  @ApiProperty({
    description: '인증 제공 업체',
    required: true,
    type: AuthProvider,
    example: AuthProvider.KAKAO,
  })
  authProvider: AuthProvider;

  @ApiProperty({
    description: '전화번호',
    required: true,
    type: String,
    example: '01012345678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'SMS 인증 ID',
    required: true,
    type: String,
  })
  verificationId: string;
}
