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
    let customerLocation = null;
    if (dto.latitude && dto.longitude) {
      customerLocation = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    const updatedCustomer = await this.customerService.update({
      ...customer,
      ...dto,
      customerLocation,
    });

    return {
      customerId: updatedCustomer.customerId,
      uuid: updatedCustomer.uuid,
      customerName: updatedCustomer.customerName,
      customerPhoneNumber: updatedCustomer.customerPhoneNumber,
      customerLocation: updatedCustomer.customerLocation,
      authProvider: updatedCustomer.authProvider,
    };
  }
}
