import { BaseHandler } from './base.handler';
import { PrismaService } from '../../prisma/prisma.service';

export class ProductHandler extends BaseHandler {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async handle(message: string, sessionId: string) {
    // Search product FAQs
    const productFaqs = await this.prisma.productFaq.findMany({
      where: {
        isActive: true,
        OR: [
          { productName: { contains: message, mode: 'insensitive' } },
          { question: { contains: message, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });

    if (productFaqs.length === 0) {
      const template = await this.getTemplate('PRODUCT_SEARCH', 'NOT_FOUND', {
        query: message,
      });

      return {
        response:
          template ||
          `죄송합니다. "${message}"에 대한 상품 정보를 찾을 수 없습니다.`,
        metadata: { intent: 'PRODUCT_SEARCH', found: false },
      };
    }

    // Group by product
    const productGroups = productFaqs.reduce(
      (acc, faq) => {
        if (!acc[faq.productId]) {
          acc[faq.productId] = {
            productName: faq.productName,
            faqs: [],
          };
        }
        acc[faq.productId].faqs.push(faq);
        return acc;
      },
      {} as Record<string, { productName: string; faqs: any[] }>,
    );

    let response = '🔍 상품 정보\n\n';

    Object.values(productGroups).forEach((group) => {
      response += `**${group.productName}**\n`;
      group.faqs.forEach((faq) => {
        response += `\nQ: ${faq.question}\n`;
        response += `A: ${faq.answer}\n`;
      });
      response += '\n';
    });

    return {
      response,
      metadata: {
        intent: 'PRODUCT_SEARCH',
        productCount: Object.keys(productGroups).length,
      },
    };
  }
}
