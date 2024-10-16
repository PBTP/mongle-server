import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  private readonly algorithm: string;
  private readonly secretKey: string;
  private iv = crypto.randomBytes(16); // 초기화 벡터(IV)

  constructor(private readonly configService: ConfigService) {
    this.algorithm = this.configService.get('security/crypto/algorithm');
    this.secretKey = this.configService.get('security/crypto/key');
  }

  encrypt(text: string): string {
    if (!text) return null;

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${this.iv.toString('hex')}:${encrypted.toString('hex')}`; // IV와 암호화된 데이터를 함께 반환
  }

  decrypt(hash: string): string {
    if (!hash) return null;

    const [iv, encryptedText] = hash.split(':');

    if (!iv || !encryptedText) {
      return null;
    }

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, 'hex'),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
