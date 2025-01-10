import { Injectable } from '@nestjs/common';
import { PreRegistrationSurveyRequest } from './pre-registration-survey-request';
import { EmailService } from 'src/email/email.service';
import { EmailContentGenerator } from './email-content-generator';

@Injectable()
export class PreRegistrationSurveyUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(request: PreRegistrationSurveyRequest): Promise<void> {
    const subject = '[몽글몽글] 사전 등록 신청이 완료되었습니다.';
    const text = EmailContentGenerator.generateTextContent(request);
    const html = EmailContentGenerator.generateHtmlContent(request);

    await this.emailService.sendEmail(request.email, subject, text, html);
  }
}
