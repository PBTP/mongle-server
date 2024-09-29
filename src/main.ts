import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './config/logger/logger.config';
import { ValidationDefaultOption } from './common/validation/validation.data';
import { RedisIoAdapter } from './config/socket/socket.adapter';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EntityNotFoundExceptionFilter } from './common/filters/entit-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: [
      'https://mgmg.life',
      'https://web-view.mgmg.life',
      'http://localhost:8000',
      'http://localhost:3000',
    ],
  });

  app.useLogger(app.get<LoggerService>(LoggerService));
  app.useGlobalPipes(new ValidationPipe(ValidationDefaultOption));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get<Reflector>(Reflector)),
  );

  const redisIoAdapter = new RedisIoAdapter(app, app.get(RedisService));

  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const config = new DocumentBuilder()
    .setTitle('몽글몽글 API')
    .setDescription('반려견 출장 목욕 서비스 몽글몽글의 API 문서입니다.')
    .setVersion('1.0')
    .addTag('Mongle', '몽글몽글 API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
