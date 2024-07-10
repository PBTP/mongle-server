import {
  applyDecorators,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpToSocketExceptionFilter } from '../application/http-to-socket-exception.filter';
import { SubscribeMessage } from '@nestjs/websockets';
// Socket은 ValidationPipe와 Filter가 글로벌 적용되지 않기 때문에  Subscribe 데코레이터를 만들어서 사용한다.

export function Subscribe(message: string) {
  return applyDecorators(
    UsePipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    ),
    UseFilters(HttpToSocketExceptionFilter),
    SubscribeMessage(message),
  );
}
