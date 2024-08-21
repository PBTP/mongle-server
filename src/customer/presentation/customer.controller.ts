import { CustomerService } from '../application/customer.service';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { CustomerDto } from './customer.dto';
import { Customer } from '../../schemas/customers.entity';
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './update-profile.dto';

@ApiTags('고객 관련 API')
@Controller('/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
      profileImageUrl: customer.profileImageUrl,
      authProvider: customer.authProvider,
    };
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보를 수정합니다.',
  })
  @ApiOkResponse({ type: CustomerDto, description: '사용자 정보 수정 성공' })
  @Auth()
  @Put()
  async updateProfile(
    @CurrentCustomer() customer: Customer,
    @Body() dto: UpdateProfileDto,
  ): Promise<Omit<CustomerDto, 'refreshToken'>> {
    customer.customerName = dto.customerName
      ? dto.customerName
      : customer.customerName;
    customer.customerPhoneNumber = dto.customerPhoneNumber
      ? dto.customerPhoneNumber
      : customer.customerPhoneNumber;
    customer.customerLocation = dto.customerLocation
      ? dto.customerLocation
      : customer.customerLocation;

    const updatedCustomer = await this.customerService.update(customer);

    return {
      customerId: updatedCustomer.customerId,
      uuid: updatedCustomer.uuid,
      customerName: updatedCustomer.customerName,
      customerPhoneNumber: updatedCustomer.customerPhoneNumber,
      customerLocation: updatedCustomer.customerLocation,
      profileImageUrl: updatedCustomer.profileImageUrl,
      authProvider: updatedCustomer.authProvider,
    };
  }
}
