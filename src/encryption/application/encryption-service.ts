import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EncryptionServiceInterface } from '../domain/encryption-service.interface';

@Injectable()
export class EncryptionService implements EncryptionServiceInterface {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey: string;
  private readonly ivLength = 16;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('encryption.secretKey');
  }

  encrypt(text: string): string {
    const iv = randomBytes(this.ivLength);
    const key = scryptSync(this.secretKey, 'salt', 32);
    const cipher = createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(hash: string): string {
    const [ivHex, encryptedText] = hash.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = scryptSync(this.secretKey, 'salt', 32);
    const decipher = createDecipheriv(this.algorithm, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
