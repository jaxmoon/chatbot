import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((origin) =>
    origin.trim(),
  );

  if (!allowedOrigins && process.env.NODE_ENV === 'production') {
    throw new Error(
      '⛔ ALLOWED_ORIGINS environment variable is required in production',
    );
  }

  app.enableCors({
    origin: allowedOrigins || '*',
    credentials: true,
  });

  // Validation Pipe 전역 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('E-commerce Chatbot API')
    .setDescription('Customer service chatbot API documentation')
    .setVersion('1.0')
    .addTag('Chatbot', '채팅봇 세션 및 메시지 관리')
    .addTag('Quick Replies', '퀵 리플라이 조회')
    .addTag('FAQ (Admin)', 'FAQ 관리 (관리자용)')
    .addTag('Widget', '위젯 설정')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📖 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
