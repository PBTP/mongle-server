export class FakeSecurityService {
  encrypt(text: string): string {
    return 'encrypted';
  }

  decrypt(hash: string): string {
    return 'decrypted';
  }
}
