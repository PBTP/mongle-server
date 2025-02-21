import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // request get header
    const apiKey = request.header('x-api-key');
    console.log(`apiKey : ${apiKey}`);

    if (!apiKey || apiKey !== this.configService.get('')) {
      return false;
    }

    return true;
  }
}
