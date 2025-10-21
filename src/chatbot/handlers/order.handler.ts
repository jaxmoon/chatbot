import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class OrderHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Check if user is authenticated
    const session = await this.prisma.chatSession.findUnique({
      where: { sessionToken: sessionId },
    });

    if (!session?.userId) {
      const template = await this.getTemplate('ORDER_STATUS', 'NEED_LOGIN');

      return {
        response:
          template ||
          '주문 조회를 위해서는 로그인이 필요합니다. 로그인 후 다시 시도해주세요.',
        metadata: {
          intent: 'ORDER_STATUS',
          requiresAuth: true,
        },
      };
    }

    // In production, this would fetch actual order data from external service
    return {
      response:
        '주문 조회 기능은 현재 개발 중입니다. 마이페이지에서 주문 내역을 확인하실 수 있습니다.',
      metadata: {
        intent: 'ORDER_STATUS',
        userId: session.userId,
      },
    };
  }
}
