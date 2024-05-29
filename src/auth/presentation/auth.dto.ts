import { CustomerDto } from 'src/customer/presentation/customer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto extends CustomerDto {
  @ApiProperty({
    description: 'Access Token',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
    type: String,
  })
  refreshToken: string;
}
