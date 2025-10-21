import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuickReplyService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuickReplies(
    trigger: 'session_start' | 'after_intent' | 'after_flow',
    context?: {
      intent?: string;
      flowId?: string;
    },
  ) {
    let triggerOn: string = trigger;

    if (trigger === 'after_intent' && context?.intent) {
      triggerOn = `after_intent:${context.intent}`;
    }

    if (trigger === 'after_flow' && context?.flowId) {
      triggerOn = `after_flow:${context.flowId}`;
    }

    const quickReplies = await this.prisma.quickReply.findMany({
      where: {
        isActive: true,
        triggerOn,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return quickReplies.map((qr) => ({
      id: qr.id,
      label: qr.label,
      value: qr.value,
      icon: qr.icon,
    }));
  }

  async getWelcomeQuickReplies() {
    return this.getQuickReplies('session_start');
  }

  async getContextualQuickReplies(intent: string) {
    return this.getQuickReplies('after_intent', { intent });
  }
}
