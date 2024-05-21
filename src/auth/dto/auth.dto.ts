import { CustomerDto } from 'src/customer/dto/customer.dto';

export class AuthDto extends CustomerDto {
  accessToken: string;
  refreshToken: string;
}
