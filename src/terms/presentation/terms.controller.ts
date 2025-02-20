import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { CustomerEntity } from '../../schemas/customer.entity';
import { TermService } from '../application/terms.service';
import { CustomerTermDto } from './customer-terms.dto';
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
    summary: '동의가 필요한 약관 조회',
    description: '특정 고객이 미동의한 약관 목록을 불러옵니다.',
  })
  @ApiOkResponse({ type: [CustomerTermDto] })
  @Get('/term/my')
  async findPendingTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<TermDto[]> {
    return await this.termService.findPendingTerms(customer);
  }

  @ApiOperation({
    summary: '고객 약관 동의 내역 등록',
    description: '특정 고객의 약관 동의 내역을 등록합니다.',
  })
  @ApiOkResponse({ type: [CustomerTermDto] })
  @Post('/term') // 신규 등록
  @Patch('/term') // 기존 수정 //todo: POST & PATCH 처리를 이런 식으로 해도 되나
  async saveCustomerTerms(
    @Body() terms: CustomerTermDto[],
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<CustomerTermDto[]> {
    return await this.termService.saveCustomerTerms(terms, customer);
  }

  // @ApiOperation({
  //   summary: '고객 약관 동의 내역 조회',
  //   description: '특정 고객의 약관 동의 내역을 불러옵니다.',
  // })
  // @ApiOkResponse({ type: [CustomerTermDto] })
  // @Get('/term/my')
  // async findCustomerTerms(
  //   @CurrentCustomer() customer: CustomerEntity,
  // ): Promise<TermDto[]> {
  //   return await this.termService.findCutomerTerms(customer);
  // }
}
