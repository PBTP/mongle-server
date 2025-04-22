import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `${this.appService.getHello()} (${process.env.NODE_NAME || '알 수 없음'})`;
  }
}
