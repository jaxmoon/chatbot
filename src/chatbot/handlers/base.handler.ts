import { PrismaService } from '../../prisma/prisma.service';

export abstract class BaseHandler {
  protected prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  abstract handle(
    message: string,
    sessionId: string,
  ): Promise<{ response: string; metadata?: any }>;

  protected async getTemplate(
    intentName: string,
    templateKey: string,
    variables?: Record<string, string>,
  ): Promise<string> {
    const template = await this.prisma.chatTemplate.findUnique({
      where: {
        intentName_templateKey: {
          intentName,
          templateKey,
        },
      },
    });

    if (!template) return '';

    let content = template.content;

    // Replace variables
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }

    return content;
  }
}
