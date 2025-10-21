import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FlowManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async shouldStartFlow(intent: string, message: string): Promise<boolean> {
    const flows = await this.prisma.conversationFlow.findMany({
      where: {
        isActive: true,
        triggerIntent: intent,
      },
    });

    if (flows.length === 0) return false;

    // Check if message matches trigger keywords
    return flows.some((flow) =>
      flow.triggerKeywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
  }

  async getFlow(intent: string) {
    return this.prisma.conversationFlow.findFirst({
      where: {
        isActive: true,
        triggerIntent: intent,
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getCurrentStep(flowId: string, stepId: string) {
    return this.prisma.flowStep.findUnique({
      where: {
        id: stepId,
      },
    });
  }

  async getNextStep(
    currentStepId: string,
    userResponse: string,
    flowData: any,
  ): Promise<string | null> {
    const currentStep = await this.prisma.flowStep.findUnique({
      where: { id: currentStepId },
    });

    if (!currentStep) return null;

    const logic = currentStep.nextStepLogic as any;

    // If there's a default next step
    if (logic.default) {
      const nextStep = await this.prisma.flowStep.findFirst({
        where: {
          flowId: currentStep.flowId,
          stepKey: logic.default,
        },
      });
      return nextStep?.id || null;
    }

    // Check conditional logic
    if (logic.conditions && Array.isArray(logic.conditions)) {
      for (const condition of logic.conditions) {
        if (this.evaluateCondition(condition.if, userResponse, flowData)) {
          const nextStep = await this.prisma.flowStep.findFirst({
            where: {
              flowId: currentStep.flowId,
              stepKey: condition.then,
            },
          });
          return nextStep?.id || null;
        }
      }
    }

    return null;
  }

  private evaluateCondition(
    condition: string,
    userResponse: string,
    flowData: any,
  ): boolean {
    // Simple condition evaluation
    // In production, use a proper expression evaluator
    try {
      // Replace variables with actual values
      let expr = condition;

      // Replace budget example: "budget < 50000"
      if (flowData.budget !== undefined) {
        expr = expr.replace(/budget/g, flowData.budget.toString());
      }

      // Evaluate simple comparisons
      if (expr.includes('<')) {
        const [left, right] = expr.split('<').map((s) => s.trim());
        return Number(left) < Number(right);
      }

      if (expr.includes('>=')) {
        const [left, right] = expr.split('>=').map((s) => s.trim());
        return Number(left) >= Number(right);
      }

      return false;
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  async updateFlowData(
    sessionId: string,
    stepKey: string,
    userResponse: string,
  ) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return;

    const currentFlowData = (session.flowData as any) || {};

    // Extract data based on step
    const step = await this.prisma.flowStep.findFirst({
      where: {
        flowId: session.currentFlowId!,
        stepKey,
      },
    });

    if (!step || !step.collectData) return;

    // Update flow data with collected information
    currentFlowData[step.collectData] = userResponse;

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { flowData: currentFlowData },
    });
  }
}
