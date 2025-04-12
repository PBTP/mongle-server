import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '@auth/decorator/auth.decorator';
import { ResponseEntity } from '@common/dto/response.entity';
import { CustomerEntity } from '@schemas/customer.entity';
import { TermService } from '../application/terms.service';
import { CustomerTermDto } from './customer-terms.dto';
import { TermDto } from './terms.dto';
import { CustomerTerm } from '../customer-terms.domain';
import { Term } from '../terms.domain';

@ApiTags('약관 관련 API')
@Controller('/v1/')
export class TermController {
  constructor(private readonly termService: TermService) { }

  @ApiOperation({ summary: '전체 약관 목록 조회' })
  @ApiOkResponse({ type: [TermDto] })
  @Get('/terms')
  async findAllTerms(): Promise<ResponseEntity<TermDto[]>> {
    const terms = await this.termService.findAll();
    return ResponseEntity.OK(terms.map(TermDto.from));
  }

  @ApiOperation({ summary: '특정 약관 조회' })
  @ApiOkResponse({ type: TermDto })
  @Get('/terms/:termId')
  async findTermsById(
    @Param('termId') termId: number,
  ): Promise<ResponseEntity<TermDto | null>> {
    const term = await this.termService.findById(termId);
    return ResponseEntity.OK(term ? TermDto.from(term) : null);
  }

  @ApiOperation({ summary: '특정 고객의 동의 약관 조회' })
  @ApiOkResponse({ type: [TermDto] })
  @Get('/customer/terms')
  async findCustomerAgreedTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<CustomerTermDto[]>> {
    let terms: CustomerTerm[] = await this.termService.findAgreedTerms(customer);
    return ResponseEntity.OK(terms.map(CustomerTermDto.from));
  }

  @ApiOperation({ summary: '특정 고객의 동의가 필요한 약관 조회' })
  @ApiOkResponse({ type: [TermDto] })
  @Get('/customer/terms/pending')
  async findCustomerTerms(
    @CurrentCustomer() customer: CustomerEntity,
    @Query('status') status?: 'optional' | 'mandatory',
  ): Promise<ResponseEntity<TermDto[]>> {
    let terms: Term[] = [];

    if (status === 'mandatory') {
      terms = await this.termService.findPendingMandatoryTerms(customer);
    } else if (status === 'optional') {
      terms = await this.termService.findPendingOptionalTerms(customer);
    } else {
      terms = await this.termService.findPendingTerms(customer);
    }
    return ResponseEntity.OK(terms.map(TermDto.from));
  }

  @ApiOperation({ summary: '특정 고객의 약관 동의 저장' })
  @ApiOkResponse({ type: [CustomerTermDto] })
  @Post('/customer/terms')
  async saveCustomerTerms(
    @Body() terms: CustomerTermDto[],
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<CustomerTermDto[]>> {
    const customerTerms = await this.termService.saveCustomerTerms(terms, customer);
    return ResponseEntity.OK(customerTerms.map(CustomerTermDto.from));
  }

  @ApiOperation({ summary: '특정 고객의 특정 약관 동의 저장' })
  @ApiOkResponse({ type: CustomerTermDto })
  @Post('/customer/terms/:termId')
  async saveCustomerTerm(
    @Body() dto: CustomerTermDto,
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<CustomerTermDto>> {
    const result = await this.termService.saveCustomerTerm(dto, customer);
    return ResponseEntity.OK(CustomerTermDto.from(result));
  }

  @ApiOperation({ summary: '특정 고객의 특정 약관 동의 수정' })
  @ApiOkResponse({ type: CustomerTermDto })
  @Patch('/customer/terms')
  async updateCustomerTerm(
    @Body() dto: CustomerTermDto,
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<CustomerTermDto>> {
    const result = await this.termService.saveCustomerTerm(dto, customer);
    return ResponseEntity.OK(CustomerTermDto.from(result));
  }

  @ApiOperation({
    summary: '고객 약관 정보 삭제',
    description: '특정 고객 탈퇴 시 해당 고객의 약관 데이터를 삭제합니다.',
  })
  @ApiOkResponse({ description: '고객 약관 정보 삭제 성공' })
  @Delete('customer/terms')
  async deleteCustomerTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<void>> {
    return ResponseEntity.OK(
      await this.termService.deleteCustomerTerms(customer),
    );
  }
}
