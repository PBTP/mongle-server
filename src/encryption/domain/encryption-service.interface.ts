export const ENCRYPTION_SERVICE = 'ENCRYPTION_SERVICE';

export interface EncryptionServiceInterface {
  encrypt(text: string): string;
  decrypt(hash: string): string;
}
