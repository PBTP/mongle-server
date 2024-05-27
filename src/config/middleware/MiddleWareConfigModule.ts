import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerContextMiddleware } from './logger-context.middleware';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule],
})
export class MiddleWareConfigModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
