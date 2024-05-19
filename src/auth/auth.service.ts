import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto): Promise<string> {
    let customer: Customer = await this.customerService.findOne(dto);
    customer = customer ?? (await this.customerService.create(dto));

    return this.jwtService.sign(customer);
  }
}
