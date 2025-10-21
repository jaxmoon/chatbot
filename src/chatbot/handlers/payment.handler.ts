import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class PaymentHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Search payment-related FAQs
    const paymentFaqs = await this.prisma.faq.findMany({
      where: {
        isActive: true,
        category: {
          name: 'order',
        },
        OR: [
          { question: { contains: message, mode: 'insensitive' } },
          { keywords: { hasSome: ['결제', '구독', '요금', '카드', '환불'] } },
        ],
      },
      include: {
        category: true,
      },
      take: 3,
    });

    if (paymentFaqs.length === 0) {
      return {
        response:
          '결제 관련 문의입니다. 구체적으로 어떤 부분이 궁금하신가요? (예: 결제 수단, 주문 취소)',
        metadata: { intent: 'PAYMENT' },
      };
    }

    const bestMatch = paymentFaqs[0];

    let response = `💳 ${bestMatch.category.nameKo}\n\n`;
    response += `Q: ${bestMatch.question}\n\n`;
    response += `A: ${bestMatch.answer}`;

    return {
      response,
      metadata: {
        intent: 'PAYMENT',
        faqId: bestMatch.id,
      },
    };
  }
}
