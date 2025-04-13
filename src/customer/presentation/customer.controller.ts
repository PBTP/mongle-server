import { CustomerService } from '../application/customer.service';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { CustomerDto } from './customer.dto';
import { Auth, CurrentCustomer } from "@auth/decorator/auth.decorator";
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Customer } from '../customer.domain';
import { ResponseEntity } from "@common/dto/response.entity";

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
  ): Promise<
    ResponseEntity<Omit<CustomerDto, 'refreshToken' | 'accessToken'>>
  > {
    return ResponseEntity.OK(
      await this.customerService
        .getOne({ userId: customer.customerId }, true)
        .then((v) => {
          return Builder<CustomerDto>()
            .uuid(v.uuid)
            .userType('customer')
            .userId(v.customerId)
            .name(v.customerName)
            .customerId(v.customerId)
            .customerName(v.customerName)
            .customerPhoneNumber(v.customerPhoneNumber)
            .customerLocation(v.customerLocation)
            .customerAddress(v.customerAddress)
            .customerDetailAddress(v.customerDetailAddress)
            .authProvider(v.authProvider)
            .profileImageUrl(v.profileImage?.imageUrl)
            .build();
        }),
    );
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
    @Body() dto: CustomerDto,
  ): Promise<ResponseEntity<Omit<CustomerDto, 'refreshToken'>>> {
    dto.userId = customer.customerId;

    return ResponseEntity.OK(
      await this.customerService
        .update({
          ...customer,
          ...dto,
        })
        .then((v) => {
          return Builder(CustomerDto)
            .uuid(v.uuid)
            .userType('customer')
            .userId(v.customerId)
            .name(v.customerName)
            .customerId(v.customerId)
            .customerName(v.customerName)
            .customerPhoneNumber(v.customerPhoneNumber)
            .customerLocation(v.customerLocation)
            .customerAddress(v.customerAddress)
            .customerDetailAddress(v.customerDetailAddress)
            .authProvider(v.authProvider)
            .profileImageUrl(v?.profileImage?.imageUrl)
            .build();
        }),
    );
  }
}
