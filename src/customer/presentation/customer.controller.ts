import { CustomerService } from '../application/customer.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerDto } from './customer.dto';
import { Customer } from '../entities/customer.entity';
import { CurrentCustomer } from '../../auth/decorator/customer.decorator';

@Controller('/api/v1/customer')
export class CustomerController {
  constructor(private readonly authService: CustomerService) {}

  @Get('my')
  @UseGuards(AuthGuard())
  async getMyCustomer(
    @CurrentCustomer() customer: Customer,
  ): Promise<CustomerDto> {
    return {
      ...customer,
    };
  }
}
