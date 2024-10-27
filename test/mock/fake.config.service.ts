import { ConfigService } from '@nestjs/config';

export class FakeConfigService extends ConfigService {
  private configMap: { [key: string]: any } = {};

  override get(key: string): any {
    return this.configMap[key];
  }

  override set(key: string, value: any): void {
    this.configMap[key] = value;
  }
}
