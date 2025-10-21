import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class FaqHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Search FAQs by keywords
    const keywords = message.split(' ').filter((word) => word.length > 1);

    const faqs = await this.prisma.faq.findMany({
      where: {
        isActive: true,
        OR: [
          { question: { contains: message, mode: 'insensitive' } },
          { keywords: { hasSome: keywords } },
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

    if (faqs.length === 0) {
      return {
        response:
          '죄송합니다. 관련된 FAQ를 찾을 수 없습니다. 다른 방식으로 질문해주시겠어요?',
        metadata: { intent: 'FAQ', found: false },
      };
    }

    // Increment view count for the best match
    if (faqs[0]) {
      await this.prisma.faq.update({
        where: { id: faqs[0].id },
        data: { viewCount: { increment: 1 } },
      });
    }

    // Return the best matching FAQ
    const bestMatch = faqs[0];

    let response = `📋 ${bestMatch.category.nameKo}\n\n`;
    response += `Q: ${bestMatch.question}\n\n`;
    response += `A: ${bestMatch.answer}`;

    if (faqs.length > 1) {
      response += '\n\n💡 관련 FAQ:';
      faqs.slice(1).forEach((faq) => {
        response += `\n- ${faq.question}`;
      });
    }

    return {
      response,
      metadata: {
        intent: 'FAQ',
        faqId: bestMatch.id,
        category: bestMatch.category.name,
      },
    };
  }
}
