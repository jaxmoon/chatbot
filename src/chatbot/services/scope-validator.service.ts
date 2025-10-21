import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScopeValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  async isWithinScope(userMessage: string, intent: string): Promise<boolean> {
    // Stage 1: Keyword filter - Quick rejection
    const outOfScopeKeywords = [
      '날씨',
      '뉴스',
      '영화',
      '음악',
      '게임',
      '정치',
      '스포츠',
    ];

    const hasOutOfScopeKeyword = outOfScopeKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword),
    );

    if (hasOutOfScopeKeyword) {
      return false;
    }

    // Stage 2: Intent validation
    const validIntents = [
      'GREETING',
      'PRODUCT_SEARCH',
      'ORDER_STATUS',
      'FAQ',
      'ACCOUNT',
      'PAYMENT',
      'RETURN',
    ];

    if (intent === 'OUT_OF_SCOPE') {
      return false;
    }

    if (!validIntents.includes(intent)) {
      return false;
    }

    // Stage 3: Data existence check
    // Check if relevant data exists in database
    const hasRelevantData = await this.checkDataExistence(userMessage, intent);

    return hasRelevantData;
  }

  private async checkDataExistence(
    message: string,
    intent: string,
  ): Promise<boolean> {
    switch (intent) {
      case 'GREETING':
        return true; // Always valid

      case 'FAQ':
        const faqs = await this.prisma.faq.findMany({
          where: {
            isActive: true,
            OR: [
              { question: { contains: message, mode: 'insensitive' } },
              { keywords: { hasSome: message.split(' ') } },
            ],
          },
          take: 1,
        });
        return faqs.length > 0;

      case 'PRODUCT_SEARCH':
        const productFaqs = await this.prisma.productFaq.findMany({
          where: {
            isActive: true,
            OR: [
              { productName: { contains: message, mode: 'insensitive' } },
              { question: { contains: message, mode: 'insensitive' } },
            ],
          },
          take: 1,
        });
        return productFaqs.length > 0;

      default:
        return true; // Other intents are considered valid by default
    }
  }

  async getOutOfScopeResponse(): Promise<string> {
    const template = await this.prisma.chatTemplate.findUnique({
      where: {
        intentName_templateKey: {
          intentName: 'OUT_OF_SCOPE',
          templateKey: 'REJECT',
        },
      },
    });

    return (
      template?.content ||
      '죄송합니다. 저는 쇼핑몰 이용과 관련된 문의만 도와드릴 수 있습니다.'
    );
  }
}
