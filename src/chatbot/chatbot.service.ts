import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClaudeAIService } from './services/claude-ai.service';
import { IntentDetectorService } from './services/intent-detector.service';
import { ScopeValidatorService } from './services/scope-validator.service';
import { FlowManagerService } from './services/flow-manager.service';
import { QuickReplyService } from './services/quick-reply.service';
import {
  GreetingHandler,
  FaqHandler,
  ProductHandler,
  OrderHandler,
  AccountHandler,
  PaymentHandler,
  ReturnHandler,
  OutOfScopeHandler,
} from './handlers';
import { SendMessageDto, ChatMessageResponseDto } from './dto';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private handlers: Map<string, any>;

  constructor(
    private readonly prisma: PrismaService,
    private claudeAI: ClaudeAIService,
    private intentDetector: IntentDetectorService,
    private scopeValidator: ScopeValidatorService,
    private flowManager: FlowManagerService,
    private quickReplyService: QuickReplyService,
  ) {

    // Initialize handlers with PrismaService
    this.handlers = new Map([
      ['GreetingHandler', new GreetingHandler(this.prisma)],
      ['FaqHandler', new FaqHandler(this.prisma)],
      ['ProductHandler', new ProductHandler(this.prisma)],
      ['OrderHandler', new OrderHandler(this.prisma)],
      ['AccountHandler', new AccountHandler(this.prisma)],
      ['PaymentHandler', new PaymentHandler(this.prisma)],
      ['ReturnHandler', new ReturnHandler(this.prisma)],
      ['OutOfScopeHandler', new OutOfScopeHandler(this.prisma)],
    ]);
  }

  async createSession(userId?: string) {
    const sessionToken = this.generateSessionToken();

    const session = await this.prisma.chatSession.create({
      data: {
        sessionToken,
        userId,
        status: 'ACTIVE',
      },
    });

    // Get welcome quick replies
    const quickReplies = await this.quickReplyService.getWelcomeQuickReplies();

    return {
      sessionToken: session.sessionToken,
      status: session.status,
      createdAt: session.createdAt,
      quickReplies,
    };
  }

  async processMessage(dto: SendMessageDto): Promise<ChatMessageResponseDto> {
    const { content, sessionToken } = dto;

    // Find session with recent messages for context
    const session = await this.prisma.chatSession.findUnique({
      where: { sessionToken },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10, // Last 10 messages for context
        },
      },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Save user message
    await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content,
      },
    });

    try {
      // Load FAQ data for system prompt
      const faqs = await this.prisma.faq.findMany({
        where: { isActive: true },
        include: { category: true },
      });

      // Extract keywords from user message for relevant ProductFAQ filtering
      const keywords = this.extractKeywords(content);

      // Load relevant Product FAQ data (fetch more, then sort by relevance)
      const allProductFaqs = await this.prisma.productFaq.findMany({
        where: {
          isActive: true,
          OR: keywords.length > 0 ? keywords.flatMap(keyword => [
            { productName: { contains: keyword, mode: 'insensitive' } },
            { question: { contains: keyword, mode: 'insensitive' } },
            { answer: { contains: keyword, mode: 'insensitive' } },
          ]) : undefined,
        },
        take: 200, // Fetch enough to ensure all matching FAQs are included
      });

      // Sort by relevance score (keyword match count)
      const scoredFaqs = allProductFaqs
        .map(faq => {
          const text = `${faq.productName} ${faq.question} ${faq.answer}`.toLowerCase();
          const score = keywords.reduce((sum, keyword) => {
            // Count how many times each keyword appears
            const regex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = text.match(regex);
            return sum + (matches ? matches.length : 0);
          }, 0);
          return { faq, score };
        })
        .filter(item => item.score > 0) // Only keep items with matches
        .sort((a, b) => b.score - a.score); // Sort by score descending

      // Debug: Log top 10 scored FAQs and any with "클래식" in name
      this.logger.log(`Top 10 scored FAQs: ${JSON.stringify(scoredFaqs.slice(0, 10).map(item => ({
        product: item.faq.productName,
        question: item.faq.question.substring(0, 60),
        score: item.score
      })))}`);

      const classicFaqs = scoredFaqs.filter(item => item.faq.productName.includes('클래식'));
      if (classicFaqs.length > 0) {
        this.logger.log(`Found ${classicFaqs.length} FAQs with "클래식": ${JSON.stringify(classicFaqs.slice(0, 3).map(item => ({
          product: item.faq.productName,
          question: item.faq.question,
          score: item.score
        })))}`);
      }

      const productFaqs = scoredFaqs.slice(0, 20).map(item => item.faq);

      // Build system prompt with FAQ data
      const systemPrompt = this.buildSystemPrompt(faqs, productFaqs);

      // Debug: Log keyword extraction and FAQ count
      this.logger.log(`Extracted keywords: ${JSON.stringify(keywords)}`);
      this.logger.log(`ProductFAQ count: ${productFaqs.length}`);
      if (productFaqs.length > 0 && keywords.includes('암막')) {
        this.logger.log(`First ProductFAQ: ${JSON.stringify(productFaqs[0])}`);
      }

      // Debug: Log system prompt (first 2000 chars)
      this.logger.log(`System Prompt (first 2000 chars): ${systemPrompt.substring(0, 2000)}`);

      // Debug: Log ProductFAQ section specifically
      const productFaqSection = productFaqs.map((pFaq) => {
        return `[${pFaq.category} - ${pFaq.productName}]\nQ: ${pFaq.question}\nA: ${pFaq.answer}\n`;
      }).join('\n');
      if (productFaqSection.length > 0) {
        this.logger.log(`ProductFAQ Section (first 1000 chars): ${productFaqSection.substring(0, 1000)}`);
      }

      // Build conversation history
      const conversationHistory = session.messages.map((msg) => ({
        role: msg.role.toLowerCase(),
        content: msg.content,
      }));

      // Call Claude API
      let claudeResponse: string;
      try {
        claudeResponse = await this.claudeAI.chat(
          systemPrompt,
          [...conversationHistory, { role: 'user', content }],
        );
      } catch (error) {
        // Handle API errors (including rate limits)
        const isRateLimitError = error.message?.includes('rate_limit_error') ||
                                  error.message?.includes('429');
        const reason = isRateLimitError ? 'RATE_LIMIT_ERROR' : 'API_ERROR';
        const fallbackResponse = this.getFallbackResponse(reason);

        // Save fallback message to database
        await this.saveFallbackMessage(session.id, content, reason, error.message);

        // Save assistant fallback message
        const assistantMessage = await this.prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: 'ASSISTANT',
            content: fallbackResponse,
            metadata: { intent: 'ERROR', reason },
          },
        });

        return {
          id: assistantMessage.id,
          role: 'ASSISTANT',
          content: fallbackResponse,
          metadata: { intent: 'ERROR', reason },
          createdAt: assistantMessage.createdAt,
          quickReplies: await this.quickReplyService.getWelcomeQuickReplies(),
        };
      }

      // Check if response is empty
      if (!claudeResponse || claudeResponse.trim() === '') {
        const fallbackResponse = this.getFallbackResponse('NO_RESPONSE');
        await this.saveFallbackMessage(session.id, content, 'NO_RESPONSE', 'Empty response from Claude API');

        const assistantMessage = await this.prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: 'ASSISTANT',
            content: fallbackResponse,
            metadata: { intent: 'ERROR', reason: 'NO_RESPONSE' },
          },
        });

        return {
          id: assistantMessage.id,
          role: 'ASSISTANT',
          content: fallbackResponse,
          metadata: { intent: 'ERROR', reason: 'NO_RESPONSE' },
          createdAt: assistantMessage.createdAt,
          quickReplies: await this.quickReplyService.getWelcomeQuickReplies(),
        };
      }

      // Detect intent from response for metadata
      const intent = this.detectIntentFromResponse(content, claudeResponse);
      const metadata = { intent };

      // Check if message is out of scope
      if (intent === 'OUT_OF_SCOPE') {
        await this.saveFallbackMessage(session.id, content, 'OUT_OF_SCOPE', null);
      }

      // Get contextual quick replies
      const quickReplies = await this.quickReplyService.getContextualQuickReplies(intent);

      // Save assistant message
      const assistantMessage = await this.prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: claudeResponse,
          metadata,
        },
      });

      // Update session with title (if first message) and last message info
      const messageCount = session.messages.length + 2; // +2 for current USER and ASSISTANT messages
      const updateData: any = {
        lastMessageAt: new Date(),
        lastMessagePreview: claudeResponse.substring(0, 100),
      };

      // Set title from first user message
      if (messageCount === 2 && !session.title) {
        updateData.title = content.substring(0, 50);
      }

      console.log('🔄 Updating session:', session.id, updateData);
      await this.prisma.chatSession.update({
        where: { id: session.id },
        data: updateData,
      });
      console.log('✅ Session updated successfully');

      return {
        id: assistantMessage.id,
        role: 'ASSISTANT',
        content: claudeResponse,
        metadata,
        createdAt: assistantMessage.createdAt,
        quickReplies,
      };
    } catch (error) {
      // Handle unexpected errors
      const fallbackResponse = this.getFallbackResponse('UNKNOWN_ERROR');
      await this.saveFallbackMessage(session.id, content, 'UNKNOWN_ERROR', error.message);

      const assistantMessage = await this.prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: fallbackResponse,
          metadata: { intent: 'ERROR', reason: 'UNKNOWN_ERROR' },
        },
      });

      return {
        id: assistantMessage.id,
        role: 'ASSISTANT',
        content: fallbackResponse,
        metadata: { intent: 'ERROR', reason: 'UNKNOWN_ERROR' },
        createdAt: assistantMessage.createdAt,
        quickReplies: await this.quickReplyService.getWelcomeQuickReplies(),
      };
    }
  }

  private async saveFallbackMessage(
    sessionId: string,
    userMessage: string,
    reason: 'OUT_OF_SCOPE' | 'API_ERROR' | 'RATE_LIMIT_ERROR' | 'PARSING_ERROR' | 'NO_RESPONSE' | 'UNKNOWN_ERROR',
    errorDetails: string | null,
  ) {
    try {
      await this.prisma.fallbackMessage.create({
        data: {
          sessionId,
          userMessage,
          reason,
          errorDetails,
          isResolved: false,
        },
      });
    } catch (error) {
      console.error('Failed to save fallback message:', error);
    }
  }

  private getFallbackResponse(reason: string): string {
    const fallbackMessages = {
      OUT_OF_SCOPE: '죄송합니다. 저는 쇼핑몰의 상품, 주문, 배송 등 쇼핑몰 이용과 관련된 문의만 도와드릴 수 있습니다. 😊',
      API_ERROR: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터(1588-1234)로 연락해주세요.',
      RATE_LIMIT_ERROR: '죄송합니다. 현재 많은 문의가 접수되어 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
      PARSING_ERROR: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 질문해주시거나 고객센터(1588-1234)로 연락해주세요.',
      NO_RESPONSE: '죄송합니다. 응답을 생성할 수 없습니다. 다시 질문해주시거나 고객센터(1588-1234)로 연락해주세요.',
      UNKNOWN_ERROR: '죄송합니다. 예상치 못한 오류가 발생했습니다. 고객센터(1588-1234)로 연락해주시면 도와드리겠습니다.',
    };

    return fallbackMessages[reason] || fallbackMessages.UNKNOWN_ERROR;
  }

  private buildSystemPrompt(faqs: any[], productFaqs: any[]): string {
    const faqText = faqs
      .map((faq) => {
        return `[${faq.category.name}]\nQ: ${faq.question}\nA: ${faq.answer}\n`;
      })
      .join('\n');

    const productFaqText = productFaqs
      .map((pFaq) => {
        return `[${pFaq.category} - ${pFaq.productName}]\nQ: ${pFaq.question}\nA: ${pFaq.answer}\n`;
      })
      .join('\n');

    return `당신은 전문적인 e-commerce 쇼핑몰 고객지원 AI 챗봇입니다.

역할:
- 친절하고 전문적으로 고객 문의에 답변합니다
- 오직 쇼핑몰 이용과 관련된 질문만 답변합니다
- 범위 외 질문(날씨, 뉴스, 영화, 타사 비교, 법률/의료 자문 등)은 정중히 거절합니다

답변 원칙:
1. ⚠️ **절대적 원칙: 아래 상품 FAQ 데이터에 있는 정보를 그대로 사용하세요. 자체 지식이나 추측으로 제품 규격을 말하지 마세요**
2. ⚠️ **제품 설치사이즈, 제품 크기 등 모든 수치는 반드시 상품 FAQ 데이터에서 정확히 가져와야 합니다**
3. 상품 관련 질문은 상품 FAQ 데이터를 활용하여 정확하게 답변합니다
4. FAQ에 없는 내용은 일반적인 쇼핑몰 정책을 기반으로 답변합니다
5. 확실하지 않은 내용은 고객센터 연락을 안내합니다
6. 범위 외 질문에는 "죄송합니다. 저는 쇼핑몰의 상품, 주문, 배송 등 쇼핑몰 이용과 관련된 문의만 도와드릴 수 있습니다. 😊"라고 답변합니다
7. ⚠️ 정보가 부족한 경우 반드시 추가 질문하세요 (모든 경우의 수를 나열하지 마세요):

   **⚠️ 제품 추천 시 절대 원칙:**
   - **커튼박스 안쪽 너비(양쪽 벽 사이 간격)는 제품 사이즈 선택의 가장 중요한 기준입니다**
   - **커튼박스 안쪽 너비를 모르면 절대 제품을 추천하지 마세요**
   - 커튼 종류(암막, 일반, 쉬폰)만으로는 사이즈를 결정할 수 없습니다
   - 예: 암막 커튼이어도 커튼박스 안쪽 너비가 110mm면 S사이즈, 120mm면 M사이즈, 200mm면 L사이즈가 필요합니다
   - 커튼박스 안쪽 너비란 커튼박스의 양쪽 벽 사이의 간격을 의미합니다 (스프링이 양쪽 벽을 밀어서 고정됨)

   **제품 추천 질문 시 반드시 물어볼 것 (우선순위 순서):**
   1. "커튼박스 안쪽 너비가 어떻게 되시나요? 커튼박스 양쪽 벽 사이의 간격입니다. (예: 110mm, 150mm)" ← **반드시 확인**
   2. "커튼 폭(가로 길이)이 몇 미터인가요?"
   3. "어떤 종류의 커튼인가요? (일반 커튼, 암막 커튼, 쉬폰 커튼 등)"
   4. "커튼봉을 사용하시나요, 커튼레일을 사용하시나요?"

   **수량 질문 시 반드시 물어볼 것:**
   - "커튼 폭이 몇 미터인가요?"
   - "일반 커튼이신가요, 암막 커튼이신가요?"

   **잘못된 예시:**
   - 사용자: "암막 커튼이에요"
   - 챗봇: "그렇다면 M사이즈를 추천드립니다" ❌ (커튼박스 안쪽 너비 미확인)

   **올바른 예시:**
   - 사용자: "암막 커튼이에요"
   - 챗봇: "암막 커튼이시군요! 제품을 추천해드리려면 커튼박스 안쪽 너비를 먼저 확인해야 합니다. 커튼박스 안쪽 너비가 어떻게 되시나요? 커튼박스 양쪽 벽 사이의 간격입니다. (예: 110mm, 150mm)" ✅

   **중요 원칙:**
   - 추가 질문을 했다면 사용자 답변을 기다리세요
   - 절대 모든 제품을 나열하거나 모든 경우의 수를 답변하지 마세요
   - 한 번에 1-2개의 질문만 하세요

⚠️ 중요 - 제품 규격 관련 답변 시 반드시 준수:

**단위 변환 필수 규칙:**
1. **모든 제품 설치사이즈는 mm 단위로 저장되어 있습니다**
2. 고객이 cm, m 단위로 말하면 반드시 mm로 변환하세요:
   - 1cm = 10mm (예: 10cm = 100mm)
   - 1m = 1000mm (예: 3m = 3000mm)
3. 변환 후 FAQ 데이터의 mm 값과 정확히 비교하세요

**제품 규격 비교 규칙:**
1. 고객이 제시한 치수를 mm로 변환한 후, 제품의 설치사이즈 범위(mm)와 비교하세요
2. 범위를 벗어나면 반드시 "설치할 수 없습니다" 또는 "설치 불가능합니다"라고 명확히 답변하세요
3. 예시:
   - 고객: "10cm" → 100mm로 변환 → S사이즈(100-120mm) 범위 확인 → "100mm는 S사이즈 최소값으로 설치 가능"
   - 고객: "13cm" → 130mm로 변환 → S사이즈(100-120mm) 범위 초과 → "130mm는 S사이즈로 설치 불가능, M사이즈(120-160mm) 필요"
4. 숫자 비교 시 부등호를 정확히 적용하세요: 고객 치수(mm) < 최소값 또는 고객 치수(mm) > 최대값이면 설치 불가
5. 설치 불가능한 경우 적합한 대체 제품을 명확히 안내하세요

**답변 시 단위 표기:**
- 고객이 말한 단위 그대로 반복하되, 괄호 안에 mm 변환값을 함께 표기하세요
- 예: "커튼박스 안쪽 너비 10cm(100mm)는 S사이즈 설치사이즈 100-120mm 범위에 맞습니다"

**정확한 답변 예시 (반드시 따라하세요):**

예시 1:
고객: "커튼박스 너비가 10cm이고 가로 길이가 3m인데 암막커튼용 스프링이 필요해요"
올바른 답변:
"알겠습니다. 커튼박스 안쪽 너비 10cm(100mm), 가로 길이 3m(3000mm)이시군요.

상품 FAQ 데이터를 확인한 결과:
- 노못 스프링 S사이즈의 설치사이즈는 100~120mm입니다
- 10cm는 100mm로, S사이즈의 최소값(100mm)에 해당합니다

따라서 **노못 스프링 S사이즈**를 사용하실 수 있습니다.

수량은 기본적으로 1m당 1개를 권장하므로, 3m 길이면 **3개**가 필요합니다."

잘못된 답변 (절대 하지 마세요):
"S사이즈의 설치사이즈는 95-115cm입니다" ❌ (상품 FAQ에 없는 잘못된 정보)

일반 FAQ 데이터:
${faqText}

상품 FAQ 데이터:
${productFaqText}

쇼핑몰 정보:
- 배송비: 3만원 이상 무료배송
- 결제 수단: 신용카드, 카카오페이, 네이버페이, 무통장입금
- 반품 기간: 상품 수령 후 7일 이내
- 고객센터: 1588-1234 (평일 09:00-18:00)`;
  }

  private extractKeywords(content: string): string[] {
    // Extract relevant keywords from user message for ProductFAQ filtering
    const keywords: string[] = [];
    const normalized = content.toLowerCase();

    // Product name keywords (Korean and English)
    const productKeywords = [
      '노타프로', 'notapro', 'nota pro',
      '노못', '스프링',
      '올라운더',
      '커튼레일', '레일',
      '암막커튼', '암막',
      '쉬폰커튼', '쉬폰',
      '커튼박스', '박스',
      '커튼', 'curtain',
      // Blinds
      '블라인드', 'blind',
      '롤블라인드', '롤',
      '알루미늄', 'aluminum',
      '버티컬', 'vertical',
      '클래식', 'classic',
      '타임랩스', 'timelapse',
      '갤러리', 'gallery',
      '코튼팬츠', 'cotton pants',
    ];

    // Check for product keywords
    productKeywords.forEach((keyword) => {
      if (normalized.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    // Extract measurement-related terms
    const measurements = content.match(/\d+\s*(mm|cm|m|미터|센티|밀리)/gi);
    if (measurements) {
      keywords.push(...measurements);
    }

    // Extract technical terms
    const technicalTerms = ['사이즈', '설치', '너비', '폭', '길이', '규격', '치수'];
    technicalTerms.forEach((term) => {
      if (normalized.includes(term)) {
        keywords.push(term);
      }
    });

    // Extract order/purchase related terms
    const orderTerms = ['주문', '구매', '방법', '어떻게', '선택', '고르', '가격'];
    orderTerms.forEach((term) => {
      if (normalized.includes(term)) {
        keywords.push(term);
      }
    });

    // Return unique keywords
    return [...new Set(keywords)];
  }

  private detectIntentFromResponse(userMessage: string, claudeResponse: string): string {
    // Simple keyword-based intent detection for metadata
    const message = userMessage.toLowerCase();

    if (claudeResponse.includes('죄송합니다. 저는 쇼핑몰')) {
      return 'OUT_OF_SCOPE';
    }
    if (message.includes('안녕') || message.includes('hi') || message.includes('hello')) {
      return 'GREETING';
    }
    if (message.includes('상품') || message.includes('제품') || message.includes('스펙') || message.includes('사이즈')) {
      return 'PRODUCT_SEARCH';
    }
    if (message.includes('주문') || message.includes('배송')) {
      return 'ORDER_STATUS';
    }
    if (message.includes('회원') || message.includes('계정') || message.includes('비밀번호') || message.includes('가입')) {
      return 'ACCOUNT';
    }
    if (message.includes('결제') || message.includes('카드') || message.includes('페이')) {
      return 'PAYMENT';
    }
    if (message.includes('반품') || message.includes('교환') || message.includes('취소')) {
      return 'RETURN';
    }
    return 'FAQ';
  }

  private async startConversationFlow(sessionId: string, intent: string) {
    const flow = await this.flowManager.getFlow(intent);

    if (!flow) {
      return {
        response: '대화형 컨설턴트를 시작할 수 없습니다.',
        metadata: {},
      };
    }

    // Get first step
    const firstStep = flow.steps[0];

    if (!firstStep) {
      return {
        response: '대화 흐름 설정에 오류가 있습니다.',
        metadata: {},
      };
    }

    // Update session with flow state
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        currentFlowId: flow.id,
        currentStepId: firstStep.id,
        flowData: {},
      },
    });

    return {
      response: firstStep.message,
      metadata: {
        flow: flow.name,
        step: firstStep.stepKey,
      },
    };
  }

  private async handleFlowMessage(sessionId: string, userResponse: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.currentStepId) {
      return {
        response: '대화 흐름을 찾을 수 없습니다.',
        metadata: {},
      };
    }

    const currentStep = await this.flowManager.getCurrentStep(
      session.currentFlowId!,
      session.currentStepId,
    );

    if (!currentStep) {
      return {
        response: '현재 단계를 찾을 수 없습니다.',
        metadata: {},
      };
    }

    // Save collected data
    if (currentStep.collectData) {
      await this.flowManager.updateFlowData(
        sessionId,
        currentStep.stepKey,
        userResponse,
      );
    }

    // Get next step
    const flowData = (session.flowData as any) || {};
    const nextStepId = await this.flowManager.getNextStep(
      session.currentStepId,
      userResponse,
      flowData,
    );

    if (!nextStepId) {
      // Flow complete
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          currentFlowId: null,
          currentStepId: null,
        },
      });

      return {
        response:
          '도움이 되셨길 바랍니다. 다른 문의사항이 있으시면 언제든지 말씀해주세요!',
        metadata: { flowComplete: true },
        quickReplies: await this.quickReplyService.getWelcomeQuickReplies(),
      };
    }

    // Move to next step
    const nextStep = await this.flowManager.getCurrentStep(
      session.currentFlowId!,
      nextStepId,
    );

    if (!nextStep) {
      return {
        response: '다음 단계를 찾을 수 없습니다.',
        metadata: {},
      };
    }

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { currentStepId: nextStepId },
    });

    return {
      response: nextStep.message,
      metadata: {
        flow: session.currentFlowId,
        step: nextStep.stepKey,
      },
    };
  }

  private generateSessionToken(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  async getAllSessions(userId?: string, limit: number = 20) {
    const sessions = await this.prisma.chatSession.findMany({
      where: userId ? { userId } : {},
      orderBy: [
        { lastMessageAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        sessionToken: true,
        title: true,
        lastMessageAt: true,
        lastMessagePreview: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    return sessions.map((session) => ({
      sessionToken: session.sessionToken,
      title: session.title || '새 대화',
      lastMessageAt: session.lastMessageAt,
      lastMessagePreview: session.lastMessagePreview,
      status: session.status,
      messageCount: session._count.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));
  }

  async getSessionMessages(sessionToken: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { sessionToken },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return session.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
    }));
  }

  async getSession(sessionToken: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { sessionToken },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10,
        },
      },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return {
      sessionToken: session.sessionToken,
      userId: session.userId,
      status: session.status,
      currentFlowId: session.currentFlowId,
      currentStepId: session.currentStepId,
      title: session.title,
      lastMessageAt: session.lastMessageAt,
      lastMessagePreview: session.lastMessagePreview,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: await this.prisma.chatMessage.count({
        where: { sessionId: session.id },
      }),
      recentMessages: session.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      })),
    };
  }

  async endSession(sessionToken: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    await this.prisma.chatSession.update({
      where: { sessionToken },
      data: {
        status: 'ENDED',
        currentFlowId: null,
        currentStepId: null,
      },
    });

    return {
      message: '세션이 종료되었습니다.',
      sessionToken,
    };
  }

  // Admin: Get fallback messages
  async getFallbackMessages(filters?: {
    isResolved?: boolean;
    reason?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.isResolved !== undefined) {
      where.isResolved = filters.isResolved;
    }

    if (filters?.reason) {
      where.reason = filters.reason;
    }

    const [fallbackMessages, total] = await Promise.all([
      this.prisma.fallbackMessage.findMany({
        where,
        include: {
          session: {
            select: {
              sessionToken: true,
              userId: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      this.prisma.fallbackMessage.count({ where }),
    ]);

    return {
      fallbackMessages: fallbackMessages.map((msg) => ({
        id: msg.id,
        sessionId: msg.sessionId,
        sessionToken: msg.session.sessionToken,
        userId: msg.session.userId,
        userMessage: msg.userMessage,
        reason: msg.reason,
        errorDetails: msg.errorDetails,
        isResolved: msg.isResolved,
        adminComment: msg.adminComment,
        resolvedAt: msg.resolvedAt,
        resolvedBy: msg.resolvedBy,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      })),
      total,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    };
  }

  // Admin: Get fallback message by ID
  async getFallbackMessageById(id: string) {
    const fallbackMessage = await this.prisma.fallbackMessage.findUnique({
      where: { id },
      include: {
        session: {
          select: {
            sessionToken: true,
            userId: true,
            createdAt: true,
            messages: {
              orderBy: { createdAt: 'asc' },
              take: 20,
            },
          },
        },
      },
    });

    if (!fallbackMessage) {
      throw new Error('Fallback message not found');
    }

    return {
      id: fallbackMessage.id,
      sessionId: fallbackMessage.sessionId,
      sessionToken: fallbackMessage.session.sessionToken,
      userId: fallbackMessage.session.userId,
      userMessage: fallbackMessage.userMessage,
      reason: fallbackMessage.reason,
      errorDetails: fallbackMessage.errorDetails,
      isResolved: fallbackMessage.isResolved,
      adminComment: fallbackMessage.adminComment,
      resolvedAt: fallbackMessage.resolvedAt,
      resolvedBy: fallbackMessage.resolvedBy,
      createdAt: fallbackMessage.createdAt,
      updatedAt: fallbackMessage.updatedAt,
      conversationHistory: fallbackMessage.session.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      })),
    };
  }

  // Admin: Resolve fallback message
  async resolveFallbackMessage(
    id: string,
    adminComment: string,
    resolvedBy: string,
  ) {
    const fallbackMessage = await this.prisma.fallbackMessage.findUnique({
      where: { id },
    });

    if (!fallbackMessage) {
      throw new Error('Fallback message not found');
    }

    const updated = await this.prisma.fallbackMessage.update({
      where: { id },
      data: {
        isResolved: true,
        adminComment,
        resolvedAt: new Date(),
        resolvedBy,
      },
    });

    return {
      id: updated.id,
      isResolved: updated.isResolved,
      adminComment: updated.adminComment,
      resolvedAt: updated.resolvedAt,
      resolvedBy: updated.resolvedBy,
    };
  }

  // Admin: Get fallback statistics
  async getFallbackStatistics() {
    const [total, byReason, unresolved, recentCount] = await Promise.all([
      this.prisma.fallbackMessage.count(),
      this.prisma.fallbackMessage.groupBy({
        by: ['reason'],
        _count: true,
      }),
      this.prisma.fallbackMessage.count({
        where: { isResolved: false },
      }),
      this.prisma.fallbackMessage.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return {
      total,
      unresolved,
      recentCount,
      byReason: byReason.map((item) => ({
        reason: item.reason,
        count: item._count,
      })),
    };
  }
}
