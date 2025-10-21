import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class ReturnHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Search return/exchange FAQs
    const returnFaqs = await this.prisma.faq.findMany({
      where: {
        isActive: true,
        category: {
          name: 'return',
        },
        OR: [
          { question: { contains: message, mode: 'insensitive' } },
          { keywords: { hasSome: ['반품', '교환', '환불', '취소'] } },
        ],
      },
      include: {
        category: true,
      },
      take: 3,
      orderBy: {
        viewCount: 'desc',
      },
    });

    if (returnFaqs.length === 0) {
      return {
        response:
          '반품/교환 관련 문의입니다. 구체적으로 어떤 부분이 궁금하신가요? (예: 반품 방법, 교환 기간)',
        metadata: { intent: 'RETURN' },
      };
    }

    const bestMatch = returnFaqs[0];

    let response = `🔄 ${bestMatch.category.nameKo}\n\n`;
    response += `Q: ${bestMatch.question}\n\n`;
    response += `A: ${bestMatch.answer}`;

    if (returnFaqs.length > 1) {
      response += '\n\n💡 관련 안내:';
      returnFaqs.slice(1).forEach((faq) => {
        response += `\n- ${faq.question}`;
      });
    }

    return {
      response,
      metadata: {
        intent: 'RETURN',
        faqId: bestMatch.id,
      },
    };
  }
}
