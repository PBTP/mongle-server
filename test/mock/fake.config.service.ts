import { ConfigService } from '@nestjs/config';

export class FakeConfigService extends ConfigService {
  private configMap: { [key: string]: any } = {};

  constructor() {
    super();
    this.configMap['security/crypto/algorithm'] = 'aes-256-cbc';
    this.configMap['security/crypto/key'] = 'mgmg_crypto_HSphC1OlzYwJmSS1Or1K';
  }

  override get(key: string): any {
    return this.configMap[key];
  }

  override set(key: string, value: any): void {
    this.configMap[key] = value;
  }
}
