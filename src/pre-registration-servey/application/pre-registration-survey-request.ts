export interface PreRegistrationSurveyRequest {
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  region: string;
  reservationPlatform: string;
  snsContact?: string;
  phoneInterview: boolean;
}
