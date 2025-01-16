import { Module } from '@nestjs/common';
import { PreRegistrationSurveyUseCase } from './application/pre-registration-survey-use-case';
import { PreRegistrationSurveyController } from './presentation/pre-registration-survey-controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [PreRegistrationSurveyController],
  providers: [PreRegistrationSurveyUseCase],
})
export class PreRegistrationServeyModule {}
