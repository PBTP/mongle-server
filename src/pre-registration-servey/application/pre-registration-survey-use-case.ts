import { Injectable } from '@nestjs/common';
import { PreRegistrationSurveyRequest } from './pre-registration-survey-request';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PreRegistrationSurveyUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(request: PreRegistrationSurveyRequest): Promise<void> {
    const subject = '사전 등록 설문';
    const text = `사전 등록 설문이 완료되었습니다. ${JSON.stringify(request)}`;
    const html = `
      <div>
        <h1>사전 등록 설문</h1>
        <p>사전 등록 설문이 완료되었습니다.</p>
        <p>이름: ${request.name}</p>
        <p>이메일: ${request.email}</p>
        <p>휴대폰 번호: ${request.phoneNumber}</p>
        <p>사업장명: ${request.businessName}</p>
        <p>지역: ${request.region}</p>
        <p>예약 플랫폼: ${request.reservationPlatform}</p>
        <p>SNS 연락 가능 여부: ${request.snsContact}</p>
        <p>전화 인터뷰 가능 여부: ${request.phoneInterview}</p>
      </div>
    `;

    await this.emailService.sendEmail(request.email, subject, text, html);
  }
}
