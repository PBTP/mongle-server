import { sendEmail } from 'src/email/infra/send-email';
import { PreRegistrationSurveyRequest } from './pre-registration-survey-request';

export class PreRegistrationSurveyUseCase {
  constructor() {}

  async execute(request: PreRegistrationSurveyRequest): Promise<void> {
    const subject = '사전 등록 설문';
    const text = `사전 등록 설문이 완료되었습니다. ${JSON.stringify(request)}`;

    await sendEmail(request.email, subject, text);
  }
}
