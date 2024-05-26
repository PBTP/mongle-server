import { CustomerService } from '../application/customer.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerDto } from './customer.dto';

@Controller('/api/v1/customer')
export class CustomerController {
  constructor(private readonly authService: CustomerService) {}

  @Get('my')
  @UseGuards(AuthGuard())
  async getMyCustomer(@Req() req: any): Promise<CustomerDto> {
    return {
      ...req.user,
    };
  }
}
