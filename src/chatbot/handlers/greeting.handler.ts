import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class GreetingHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    const response = await this.getTemplate('GREETING', 'WELCOME', {
      brandName: '우리 쇼핑몰',
    });

    return {
      response:
        response ||
        '안녕하세요! 우리 쇼핑몰 고객센터입니다. 무엇을 도와드릴까요? 😊',
      metadata: {
        intent: 'GREETING',
      },
    };
  }
}
