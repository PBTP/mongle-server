import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // request get header
    const apiKey = request.header('x-api-key') ?? request.header('X-API-KEY');

    if (!apiKey || apiKey !== this.configService.get('security/api/key')) {
      this.logger.warn(
        `API Key가 존재하지 않거나 일치하지 않습니다. Request Path: ${request.url}`,
      );
      return false;
    }

    return true;
  }
}
