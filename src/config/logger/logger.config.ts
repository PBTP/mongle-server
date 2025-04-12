import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SystemAlarmService } from "@system/system.alarm.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly env = this.configService.get('NODE_ENV');
  private readonly bar = '\n\n' + '-'.repeat(50) + '\n\n';
  private readonly logCache = new Map<string, number>(); // 메시지 캐시
  private readonly cacheDuration = 60 * 1000; // 1분 동안 캐시 유지

  constructor(
    private readonly configService: ConfigService,
    private readonly systemAlarmService: SystemAlarmService,
  ) {
    super();
  }

  override debug(message: any, ...optionalParams: any[]) {
    super.debug(`🐛 ${message}`, ...optionalParams);
  }

  override log(message: any, ...optionalParams: any[]) {
    super.log(`🪵 ${message}`, ...optionalParams);
  }

  override warn(message: any, ...optionalParams: any[]) {
    super.warn(`⚠️ ${message}`, ...optionalParams);

    this.cacheCheck('warn', message) &&
      this.env !== 'local' &&
      this.systemAlarmService.alarm(
        'logging',
        this.createMsg('warn', message, optionalParams),
      );
  }

  override error(message: any, ...optionalParams: any[]) {
    super.error(`💥 ${message}`, ...optionalParams);

    this.cacheCheck('error', message) &&
      this.env !== 'local' &&
      this.systemAlarmService.alarm(
        'logging',
        this.createMsg('error', message, optionalParams),
      );
  }

  private createMsg(
    logLevel: string,
    message: string,
    optionalParams: any[],
  ): string {
    const icon = logLevel === 'error' ? '🚨' : '⚠️';
    const upperCaseLogLevel = logLevel.toUpperCase();
    return `${this.bar}${icon} ${this.env.toString().charAt(0).toUpperCase() + this.env.toString().substring(1)} Server ${upperCaseLogLevel} ${icon}\n\n⏰ Time:${this.getDate()}\n📢 Message: ${message}\n💥 param: ${optionalParams}${this.bar}`;
  }

  private cacheCheck(logLevel: string, message: string): boolean {
    this.logCache.size > 100 && this.logCache.clear(); // 캐시 사이즈 제한

    const cacheKey = `${logLevel}:${message}`;
    const now = Date.now();

    const lastSent = this.logCache.get(cacheKey);
    if (lastSent) {
      if (now - lastSent < this.cacheDuration) {
        // 동일한 메시지가 캐시 지속 시간 내에 이미 전송된 경우 전송 생략
        return false;
      }
    }

    this.logCache.set(cacheKey, now);
    return true;
  }

  private getDate(
    locale: string = 'ko-KR',
    timezone: string = 'Asia/Seoul',
  ): string {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .replaceAll(' ', '');
  }
}
