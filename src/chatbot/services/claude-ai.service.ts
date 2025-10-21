import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeAIService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async chat(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role === 'user' || msg.role === 'USER' ? 'user' : 'assistant',
          content: msg.content,
        })),
      });

      const textContent = response.content.find((c) => c.type === 'text');
      return textContent ? textContent.text : '죄송합니다. 응답을 생성할 수 없습니다.';
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
    }
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    systemPrompt: string,
  ): Promise<{ content: string; usage?: any }> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role === 'USER' ? 'user' : 'assistant',
          content: msg.content,
        })),
      });

      const textContent = response.content.find((c) => c.type === 'text');

      return {
        content: textContent ? textContent.text : '',
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
    }
  }

  buildSystemPrompt(scope: {
    faqs: any[];
    productFaqs: any[];
    intents: any[];
  }): string {
    return `당신은 쇼핑몰 고객 응대 AI 어시스턴트입니다.

중요 규칙:
1. 제공된 FAQ, 상품 정보, 서비스 가이드 범위 내에서만 답변하세요.
2. 범위 밖의 질문에는 정중히 답변할 수 없다고 알려주세요.
3. 친절하고 전문적인 톤을 유지하세요.
4. 한국어로 답변하세요.

사용 가능한 FAQ 카테고리:
${scope.faqs.map((faq) => `- ${faq.category}: ${faq.question}`).join('\n')}

지원하는 의도 (Intents):
${scope.intents.map((intent) => `- ${intent.name}: ${intent.description}`).join('\n')}

답변 시 참고사항:
- 구체적이고 명확하게 답변하세요.
- 필요한 경우 단계별로 설명하세요.
- 추가 도움이 필요한지 확인하세요.`;
  }
}
