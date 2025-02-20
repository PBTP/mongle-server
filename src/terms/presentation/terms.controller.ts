import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { CustomerEntity } from '../../schemas/customer.entity';
import { TermService } from '../application/terms.service';
import { CustomerTermDto } from './customter-terms.dto';
import { TermDto } from './terms.dto';

@ApiTags('약관 관련 API')
@Controller('/v1/terms')
export class TermController {
  constructor(private readonly termService: TermService) {}

  @ApiOperation({
    summary: '전체 약관 목록 조회',
    description: '전체 약관 목록을 불러옵니다.',
  })
  @ApiOkResponse({ type: [TermDto] })
  @Get('/term')
  async findAllTerms(): Promise<TermDto[]> {
    return await this.termService.findAll();
  }

  @ApiOperation({
    summary: '고객 약관 동의 내역 등록',
    description: '특정 고객의 약관 동의 내역을 등록합니다.',
  })
  @ApiOkResponse({ type: [TermDto] })
  @Post('/term')
  async saveCustomerTerms(
    @Body() terms: CustomerTermDto[],
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<CustomerTermDto[]> {
    return await this.termService.saveCustomerTerms(terms, customer);
  }

  //   @ApiOperation({
  //     summary: '고객 약관 동의 내역 조회',
  //     description: '특정 고객의 약관 동의 내역을 불러옵니다',
  //   })
  //   @ApiOkResponse({ type: [TermDto] })
  //   @Get('/term')
  //   async findCustomerTerms(customerId: number): Promise<TermDto[]> {
  //     return await this.termService.find;
  //   }
}
