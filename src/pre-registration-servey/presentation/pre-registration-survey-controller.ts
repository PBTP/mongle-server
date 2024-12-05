import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PreRegistrationSurveyBody } from './pre-registration-survey-body';
import { PreRegistrationSurveyRequest } from '../application/pre-registration-survey-request';
import { PreRegistrationSurveyUseCase } from '../application/pre-registration-survey-use-case';
import { ResponseEntity } from '../../common/dto/response.entity';

@ApiTags('사전 등록 설문')
@Controller('pre-registration-survey')
export class PreRegistrationSurveyController {
  constructor(
    private readonly preRegistrationSurveyUseCase: PreRegistrationSurveyUseCase,
  ) {}

  @ApiOkResponse({
    type: ResponseEntity<void>,
    description: '사전 등록 설문 등록 성공',
  })
  @Post()
  async register(
    @Body() body: PreRegistrationSurveyBody,
  ): Promise<ResponseEntity<void>> {
    const request: PreRegistrationSurveyRequest = {
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      businessName: body.businessName,
      region: body.region,
      reservationPlatform: body.reservationPlatform,
      snsContact: body.snsContact,
      phoneInterview: body.phoneInterview,
    };
    return ResponseEntity.OK(
      await this.preRegistrationSurveyUseCase.execute(request),
    );
  }
}
