import { CustomerService } from '../application/customer.service';
import { Controller, Get } from '@nestjs/common';
import { CustomerDto } from './customer.dto';
import { Customer } from '../../schemas/customers.entity';
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('고객 관련 API')
@Controller('/v1/customer')
export class CustomerController {
  constructor(private readonly authService: CustomerService) {}

  @ApiOperation({
    summary: '내 정보 조회',
    description: 'Access Token을 통해 내 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: CustomerDto, description: '내 정보 조회 성공' })
  @Auth()
  @Get('my')
  async getMyCustomer(
    @CurrentCustomer() customer: Customer,
  ): Promise<Omit<CustomerDto, 'refreshToken' | 'accessToken'>> {
    return {
      customerId: customer.customerId,
      uuid: customer.uuid,
      customerName: customer.customerName,
      customerPhoneNumber: customer.customerPhoneNumber,
      customerLocation: customer.customerLocation,
      authProvider: customer.authProvider,
    };
  }
}
