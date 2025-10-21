import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    // Global Prisma Module
    PrismaModule,
    // 정적 파일 서빙 (위젯 파일)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public', 'widget'),
      serveRoot: '/widget',
    }),
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
