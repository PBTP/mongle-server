import { CustomerDto } from 'src/customer/dto/customer.dto';

export class AuthDto extends CustomerDto {
  token: string;
}
