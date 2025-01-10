import { PreRegistrationSurveyRequest } from './pre-registration-survey-request';

export class EmailContentGenerator {
  static generateTextContent(request: PreRegistrationSurveyRequest): string {
    return `
사전 등록 신청이 완료되었습니다.
=====================================
성함: ${request.name}
이메일 주소: ${request.email}
휴대폰 번호: ${request.phoneNumber}
업체명: ${request.businessName}
활동 지역: ${request.region}
현재 이용 중인 예약 플랫폼: ${request.reservationPlatform}
SNS 주소: ${request.snsContact}
전화 인터뷰 가능 여부: ${request.phoneInterview ? '가능' : '불가능'}
=====================================
    `;
  }

  static generateHtmlContent(request: PreRegistrationSurveyRequest): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #688edc; text-align: center;">사전 등록 신청</h1>
        <p style="text-align: center;">사전 등록 신청이 완료되었습니다.</p>
        <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; margin-top: 20px; padding: 20px; border-radius: 10px;">
          <tr style="background-color: #ffffff;">
            <td style="padding: 12px;"><strong>성함</strong></td>
            <td style="padding: 12px;">${request.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #fefdee;"><strong>이메일 주소</strong></td>
            <td style="padding: 12px; background-color: #fefdee;">${request.email}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 12px;"><strong>휴대폰 번호</strong></td>
            <td style="padding: 12px;">${request.phoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #fefdee;"><strong>업체명</strong></td>
            <td style="padding: 12px; background-color: #fefdee;">${request.businessName}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 12px;"><strong>활동 지역</strong></td>
            <td style="padding: 12px;">${request.region}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #fefdee;"><strong>현재 이용 중인 예약 플랫폼</strong></td>
            <td style="padding: 12px; background-color: #fefdee;">${request.reservationPlatform}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 12px;"><strong>SNS 주소</strong></td>
            <td style="padding: 12px;">${request.snsContact}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #fefdee;"><strong>전화 인터뷰 가능 여부</strong></td>
            <td style="padding: 12px; background-color: #fefdee;">${request.phoneInterview ? '가능' : '불가능'}</td>
          </tr>
        </table>
        <p style="text-align: center; margin-top: 20px; color: #777;">이메일을 확인해 주셔서 감사합니다.</p>
      </div>
    `;
  }
}
