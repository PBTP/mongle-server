import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { CustomerDto } from '../../customer/presentation/customer.dto';
import { Auth, CurrentBusiness } from '../../auth/decorator/auth.decorator';
import { BusinessEntity } from '../../schemas/business.entity';
import { BusinessService } from '../application/business.service';
import { BusinessDto } from './business.dto';
import { ResponseEntity } from '../../common/dto/response.entity';
import { Builder } from 'builder-pattern';

@ApiTags('업체 관련 API')
@Controller('/v1/business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({
    summary: '업체 정보 조회',
    description: 'Access Token을 통해 내 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: CustomerDto, description: '내 정보 조회 성공' })
  @Auth()
  @Get('my')
  async getMyBusinessInfo(
    @CurrentBusiness() business: BusinessEntity,
  ): Promise<ResponseEntity<BusinessDto>> {
    return ResponseEntity.OK(
      Builder(BusinessDto)
        .uuid(business.uuid)
        .name(business.businessName)
        .authProvider(business.authProvider)
        .businessId(business.businessId)
        .businessName(business.businessName)
        .businessRule(business.businessRule)
        .businessLocation(business.businessLocation)
        .businessPriceGuide(business.businessPriceGuide)
        .businessPhoneNumber(business.businessPhoneNumber)
        .build(),
    );
  }
}
