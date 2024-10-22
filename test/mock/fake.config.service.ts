import { ConfigService } from '@nestjs/config';

export class FakeConfigService extends ConfigService {
  private configMap: { [key: string]: any } = {};

  get(key: string): any {
    return this.configMap[key];
  }

  set(key: string, value: any): void {
    this.configMap[key] = value;
  }
}
