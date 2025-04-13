import { ISecurityService } from "@auth/application/security.service";

export class FakeSecurityService implements ISecurityService {
  constructor() {}

  async validateOtp(secret: string, otp: string): Promise<boolean> {
    if (otp === (await this.generateOtp())) {
      return true;
    }
    return false;
  }

  async generateOtp(): Promise<string> {
    return '123456';
  }

  encrypt(text: string): string | undefined {
    return 'encrypted';
  }

  decrypt(hash: string): string | undefined {
    return 'decrypted';
  }
}
