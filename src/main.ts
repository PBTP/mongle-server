import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
