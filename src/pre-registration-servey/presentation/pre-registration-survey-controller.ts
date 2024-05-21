import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PreRegistrationSurveyBody } from './pre-registration-survey-body';
import { PreRegistrationSurveyRequest } from '../application/pre-registration-survey-request';
import { PreRegistrationSurveyUseCase } from '../application/pre-registration-survey-use-case';

@ApiTags('사전 등록 설문')
@Controller('pre-registration-survey')
export class PreRegistrationSurveyController {
  constructor(
    private readonly preRegistrationSurveyUseCase: PreRegistrationSurveyUseCase,
  ) {}

  @Post()
  async register(
    @Body(new ValidationPipe()) body: PreRegistrationSurveyBody,
  ): Promise<void> {
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
    await this.preRegistrationSurveyUseCase.execute(request);
  }
}
