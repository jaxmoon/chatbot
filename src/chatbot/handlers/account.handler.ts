import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class AccountHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Search account-related FAQs
    const accountFaqs = await this.prisma.faq.findMany({
      where: {
        isActive: true,
        category: {
          name: 'account',
        },
        OR: [
          { question: { contains: message, mode: 'insensitive' } },
          { keywords: { hasSome: message.split(' ') } },
        ],
      },
      include: {
        category: true,
      },
      take: 3,
    });

    if (accountFaqs.length === 0) {
      return {
        response:
          '회원 정보 관련 문의입니다. 더 구체적으로 질문해주시겠어요? (예: 비밀번호 찾기, 회원가입 방법)',
        metadata: { intent: 'ACCOUNT' },
      };
    }

    const bestMatch = accountFaqs[0];

    let response = `👤 ${bestMatch.category.nameKo}\n\n`;
    response += `Q: ${bestMatch.question}\n\n`;
    response += `A: ${bestMatch.answer}`;

    return {
      response,
      metadata: {
        intent: 'ACCOUNT',
        faqId: bestMatch.id,
      },
    };
  }
}
