import { CustomerService } from '../application/customer.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerDto } from './customer.dto';
import { Customer } from '../../schemas/customers.entity';
import { CurrentCustomer } from '../../auth/decorator/customer.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('고객 관련 API')
@Controller('/v1/customer')
export class CustomerController {
  constructor(private readonly authService: CustomerService) {}

  @ApiOperation({
    summary: '내 정보 조회',
    description: 'Access Token을 통해 내 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: CustomerDto, description: '내 정보 조회 성공' })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized / Access Token이 만료되었거나 잘못되었습니다. 토큰을 갱신하세요',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('my')
  async getMyCustomer(
    @CurrentCustomer() customer: Customer,
  ): Promise<Omit<CustomerDto, 'refreshToken'>> {
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
