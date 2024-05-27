import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { winstonLogger } from './config/middleware/logger.config';
import { SystemAlarmService } from './config/system.alarm.service';
import { ExceptionsFilter } from './config/middleware/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });

  app.enableCors({
    origin: ['https://mgmg.life', 'http://localhost:8000'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const systemAlarmService = app.get<SystemAlarmService>(SystemAlarmService);
  app.useGlobalFilters(new ExceptionsFilter(systemAlarmService));

  const config = new DocumentBuilder()
    .setTitle('몽글몽글 API')
    .setDescription('반려견 출장 목욕 서비스 몽글몽글의 API 문서입니다.')
    .setVersion('1.0')
    .addTag('Mongle', '몽글몽글 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
