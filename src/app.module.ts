import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreRegistrationSurveyUseCase } from './pre-registration-servey/application/pre-registration-survey-use-case';
import { PreRegistrationSurveyController } from './pre-registration-servey/presentation/pre-registration-survey-controller';

@Module({
  imports: [],
  controllers: [AppController, PreRegistrationSurveyController],
  providers: [AppService, PreRegistrationSurveyUseCase],
})
export class AppModule {}
