import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class OutOfScopeHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    const template = await this.getTemplate('OUT_OF_SCOPE', 'REJECT');

    return {
      response:
        template ||
        '죄송합니다. 저는 쇼핑몰의 상품, 주문, 배송 등 쇼핑몰 이용과 관련된 문의만 도와드릴 수 있습니다. 😊',
      metadata: {
        intent: 'OUT_OF_SCOPE',
      },
    };
  }
}
