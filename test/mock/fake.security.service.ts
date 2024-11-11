export class FakeSecurityService {
  constructor() {}

  encrypt(text: string): string | undefined {
    return 'encrypted';
  }

  decrypt(hash: string): string | undefined {
    return 'decrypted';
  }
}
