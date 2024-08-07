export const SMS_SERVICE = 'SMS_SERVICE';

export interface SmsService {
  sendSMS(phoneNumber: string, message: string): Promise<void>;
}
