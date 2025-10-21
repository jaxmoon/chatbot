import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntentDetectorService {
  constructor(private readonly prisma: PrismaService) {}

  async detectIntent(userMessage: string): Promise<{
    intent: string;
    confidence: number;
    handler: string;
  }> {
    // Load all active intents
    const intents = await this.prisma.questionIntent.findMany({
      where: { isActive: true },
    });

    // Simple keyword matching algorithm
    // In production, use more sophisticated NLP or ML model
    const scores = intents.map((intent) => {
      const keywords = intent.patterns;
      const matchCount = keywords.filter((keyword) =>
        userMessage.toLowerCase().includes(keyword.toLowerCase()),
      ).length;

      const confidence = matchCount / keywords.length;

      return {
        intent: intent.name,
        handler: intent.handler,
        confidence,
      };
    });

    // Sort by confidence and get the best match
    scores.sort((a, b) => b.confidence - a.confidence);

    const bestMatch = scores[0];

    // If confidence is too low, return OUT_OF_SCOPE
    if (!bestMatch || bestMatch.confidence < 0.3) {
      return {
        intent: 'OUT_OF_SCOPE',
        handler: 'OutOfScopeHandler',
        confidence: 0,
      };
    }

    return bestMatch;
  }

  async getIntentByName(intentName: string) {
    return this.prisma.questionIntent.findUnique({
      where: { name: intentName },
    });
  }
}
