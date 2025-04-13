import { ISmsService } from "@common/sender/sms/application/sms.service";

export class FakeSmsService implements ISmsService {
  constructor() {}

  send(phoneNumber: string, message: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
