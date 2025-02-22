import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { ResponseEntity } from '../../common/dto/response.entity';
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
    summary: '특정 약관 조회',
    description: '약관 ID를 기반으로 특정 약관 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: TermDto })
  @Get('/term/:termId')
  async findTermsById(
    @Param('termId') termId: number,
  ): Promise<TermDto | null> {
    // todo: null 가능여부 확인
    return await this.termService.findById(termId);
  }

  @ApiOperation({
    summary: '동의가 필요한 약관 조회',
    description: '특정 고객이 미동의한 약관 목록을 불러옵니다.',
  })
  @ApiOkResponse({ type: [TermDto] })
  @Get('/term/my')
  async findPendingTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<TermDto[]> {
    return await this.termService.findPendingTerms(customer);
  }

  @ApiOperation({
    summary: '특정 약관 동의 여부 조회',
    description:
      '고객이 특정 약관을 새로 동의할 필요가 있는지 확인합니다. (최신 버전 약관 동의 여부 확인)',
  })
  @ApiOkResponse({ type: Boolean })
  @Get('/term/my/:termId/agreed')
  async checkTerm(
    @CurrentCustomer() customer: CustomerEntity,
    @Param('termId') termId: number,
  ): Promise<boolean> {
    return await this.termService.checkTerm(customer, termId);
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

  @ApiOperation({
    summary: '동의가 필요한 필수 약관 조회',
    description: '특정 고객이 미동의한 **필수** 약관 목록을 불러옵니다.',
  })
  @ApiOkResponse({ type: [CustomerTermDto] })
  @Get('/term/my/mandatory')
  async findPendingMandatoryTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<TermDto[]> {
    return await this.termService.findPendingMandatoryTerms(customer);
  }

  @ApiOperation({
    summary: '고객 약관 정보 삭제',
    description: '특정 고객의 약관 데이터를 삭제합니다.',
  })
  @ApiOkResponse({ description: '고객 약관 정보 삭제 성공' })
  @Delete('/term/my')
  async deleteCustomerTerms(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<void>> {
    return ResponseEntity.OK(
      await this.termService.deleteCustomerTerms(customer),
    );
  }
}
