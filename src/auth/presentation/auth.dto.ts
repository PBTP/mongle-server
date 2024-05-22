import { CustomerDto } from 'src/customer/presentation/customer.dto';

export class AuthDto extends CustomerDto {
  accessToken: string;
  refreshToken: string;
}
