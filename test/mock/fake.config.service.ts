import { ConfigService } from '@nestjs/config';

export class FakeConfigService extends ConfigService {
  private configMap: { [key: string]: any } = {};

  constructor() {
    super();
    this.configMap['security/crypto/algorithm'] = 'aes-256-cbc';
    this.configMap['security/crypto/key'] = 'mgmg_crypto_HSphC1OlzYwJmSS1Or1K';
    this.configMap['jwt/access/secret'] = 'access_secret';
    this.configMap['jwt/access/expire'] = 3600;
    this.configMap['jwt/access/strategy'] = 'unique';
    this.configMap['jwt/refresh/secret'] = 'refresh_secret';
    this.configMap['jwt/refresh/expire'] = 60 * 60 * 24 * 14;
    this.configMap['datasource/redis'] = '{"host":"localhost","port":6379}';
    this.configMap['datasource/db'] = '{"type":"mysql","host":"localhost","port":3306,"username":"root","password":"root","database":"test"}';
  }

  override get(key: string): any {
    return this.configMap[key];
  }

  override set(key: string, value: any): void {
    this.configMap[key] = value;
  }
}
