import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // FAQ Categories
  const categories = await Promise.all([
    prisma.faqCategory.create({
      data: {
        name: 'general',
        nameKo: '일반 문의',
        description: '일반적인 쇼핑몰 이용 문의',
        order: 1,
      },
    }),
    prisma.faqCategory.create({
      data: {
        name: 'product',
        nameKo: '상품 문의',
        description: '상품 관련 문의',
        order: 2,
      },
    }),
    prisma.faqCategory.create({
      data: {
        name: 'order',
        nameKo: '주문/결제',
        description: '주문 및 결제 관련 문의',
        order: 3,
      },
    }),
    prisma.faqCategory.create({
      data: {
        name: 'shipping',
        nameKo: '배송',
        description: '배송 관련 문의',
        order: 4,
      },
    }),
    prisma.faqCategory.create({
      data: {
        name: 'return',
        nameKo: '교환/반품',
        description: '교환 및 반품 관련 문의',
        order: 5,
      },
    }),
    prisma.faqCategory.create({
      data: {
        name: 'account',
        nameKo: '회원/계정',
        description: '회원 및 계정 관련 문의',
        order: 6,
      },
    }),
  ]);

  console.log('✅ Created FAQ categories');

  // Sample FAQs
  await prisma.faq.createMany({
    data: [
      // General
      {
        categoryId: categories[0].id,
        question: '영업시간이 어떻게 되나요?',
        answer: '저희 쇼핑몰은 24시간 365일 주문이 가능합니다. 고객센터는 평일 오전 9시부터 오후 6시까지 운영됩니다.',
        keywords: ['영업시간', '운영시간', '시간', '고객센터'],
        order: 1,
      },
      {
        categoryId: categories[0].id,
        question: '고객센터 연락처가 어떻게 되나요?',
        answer: '고객센터 전화번호는 1234-5678이며, 이메일은 support@example.com입니다.',
        keywords: ['고객센터', '연락처', '전화', '이메일'],
        order: 2,
      },
      // Product
      {
        categoryId: categories[1].id,
        question: '상품 재고는 어떻게 확인하나요?',
        answer: '각 상품 페이지에서 실시간 재고 현황을 확인하실 수 있습니다. "품절" 표시가 없으면 주문 가능합니다.',
        keywords: ['재고', '품절', '구매', '주문가능'],
        order: 1,
      },
      {
        categoryId: categories[1].id,
        question: '상품 상세 스펙은 어디서 보나요?',
        answer: '상품 페이지 하단의 "상세정보" 탭에서 제품 스펙, 크기, 무게 등을 확인하실 수 있습니다.',
        keywords: ['스펙', '상세정보', '사이즈', '크기', '무게'],
        order: 2,
      },
      // Order/Payment
      {
        categoryId: categories[2].id,
        question: '어떤 결제 수단을 사용할 수 있나요?',
        answer: '신용카드, 체크카드, 계좌이체, 무통장입금, 카카오페이, 네이버페이를 사용하실 수 있습니다.',
        keywords: ['결제', '결제수단', '카드', '계좌이체', '카카오페이'],
        order: 1,
      },
      {
        categoryId: categories[2].id,
        question: '주문 취소는 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 "취소하기" 버튼을 클릭하시면 됩니다. 배송 전 단계에서만 가능합니다.',
        keywords: ['주문취소', '취소', '주문', '환불'],
        order: 2,
      },
      // Shipping
      {
        categoryId: categories[3].id,
        question: '배송비는 얼마인가요?',
        answer: '3만원 이상 구매 시 무료배송이며, 3만원 미만 구매 시 배송비 3,000원이 부과됩니다.',
        keywords: ['배송비', '무료배송', '배송료', '택배비'],
        order: 1,
      },
      {
        categoryId: categories[3].id,
        question: '배송 기간은 얼마나 걸리나요?',
        answer: '주문 후 1-2일 내 출고되며, 출고 후 1-3일 내 배송됩니다. 제주/도서산간 지역은 추가 1-2일 소요됩니다.',
        keywords: ['배송기간', '배송', '언제', '도착', '일수'],
        order: 2,
      },
      {
        categoryId: categories[3].id,
        question: '배송 조회는 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 운송장 번호를 확인하실 수 있으며, 택배사 홈페이지에서 조회 가능합니다.',
        keywords: ['배송조회', '운송장', '택배', '추적'],
        order: 3,
      },
      // Return/Exchange
      {
        categoryId: categories[4].id,
        question: '반품은 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 "반품신청"을 클릭하세요. 상품 수령 후 7일 이내 가능합니다.',
        keywords: ['반품', '환불', '반품신청', '반품방법'],
        order: 1,
      },
      {
        categoryId: categories[4].id,
        question: '교환 가능한가요?',
        answer: '네, 상품 수령 후 7일 이내 교환 가능합니다. 단, 착용/사용한 제품은 교환이 어려울 수 있습니다.',
        keywords: ['교환', '교환가능', '사이즈변경'],
        order: 2,
      },
      {
        categoryId: categories[4].id,
        question: '반품 배송비는 누가 부담하나요?',
        answer: '단순 변심인 경우 고객 부담(왕복 6,000원), 상품 하자인 경우 판매자 부담입니다.',
        keywords: ['반품비용', '배송비', '왕복배송비'],
        order: 3,
      },
      // Account
      {
        categoryId: categories[5].id,
        question: '회원가입은 어떻게 하나요?',
        answer: '홈페이지 우측 상단의 "회원가입" 버튼을 클릭하시고, 이메일 또는 소셜 계정으로 가입하실 수 있습니다.',
        keywords: ['회원가입', '가입', '회원', '계정만들기'],
        order: 1,
      },
      {
        categoryId: categories[5].id,
        question: '비밀번호를 잊어버렸어요',
        answer: '로그인 페이지의 "비밀번호 찾기"를 클릭하시면 등록된 이메일로 재설정 링크를 보내드립니다.',
        keywords: ['비밀번호', '찾기', '재설정', '잊어버림'],
        order: 2,
      },
    ],
  });

  console.log('✅ Created FAQs');

  // Question Intents
  await prisma.questionIntent.createMany({
    data: [
      {
        name: 'GREETING',
        nameKo: '인사',
        description: '사용자의 인사 메시지',
        patterns: ['안녕', '반가워', '처음', '안녕하세요', 'hi', 'hello'],
        handler: 'GreetingHandler',
        requiresAuth: false,
      },
      {
        name: 'PRODUCT_SEARCH',
        nameKo: '상품 검색',
        description: '상품을 찾거나 추천을 요청하는 경우',
        patterns: ['찾아줘', '검색', '상품', '제품', '추천', '어떤게', '스펙', '사양', '크기', '사이즈', '무게', '치수', '규격'],
        handler: 'ProductHandler',
        requiresAuth: false,
      },
      {
        name: 'ORDER_STATUS',
        nameKo: '주문 조회',
        description: '주문 상태나 배송을 조회하는 경우',
        patterns: ['주문', '배송', '언제', '조회', '확인', '도착'],
        handler: 'OrderHandler',
        requiresAuth: true,
      },
      {
        name: 'FAQ',
        nameKo: 'FAQ',
        description: '자주 묻는 질문',
        patterns: ['어떻게', '방법', '가능', '되나요', '할 수 있나', '배송비', '얼마', '비용', '가격', '금액', '문의', '알려', '질문'],
        handler: 'FaqHandler',
        requiresAuth: false,
      },
      {
        name: 'ACCOUNT',
        nameKo: '계정 관리',
        description: '회원 정보나 계정 관련 문의',
        patterns: ['회원', '계정', '로그인', '비밀번호', '가입'],
        handler: 'AccountHandler',
        requiresAuth: false,
      },
      {
        name: 'PAYMENT',
        nameKo: '결제 문의',
        description: '결제나 구독 관련 문의',
        patterns: ['결제', '구독', '요금', '카드', '환불', '수단', '방식', '페이', '송금', '무통장', '취소'],
        handler: 'PaymentHandler',
        requiresAuth: false,
      },
      {
        name: 'RETURN',
        nameKo: '반품/교환',
        description: '반품이나 교환 관련 문의',
        patterns: ['반품', '교환', '환불', '취소', '반송', '철회', '변심'],
        handler: 'ReturnHandler',
        requiresAuth: false,
      },
      {
        name: 'OUT_OF_SCOPE',
        nameKo: '범위 외',
        description: '쇼핑몰과 무관한 질문',
        patterns: ['날씨', '뉴스', '영화', '음악', '게임'],
        handler: 'OutOfScopeHandler',
        requiresAuth: false,
      },
    ],
  });

  console.log('✅ Created Question Intents');

  // Chat Templates
  await prisma.chatTemplate.createMany({
    data: [
      {
        intentName: 'GREETING',
        templateKey: 'WELCOME',
        content: '안녕하세요! {{brandName}} 고객센터입니다. 무엇을 도와드릴까요? 😊',
        variables: ['brandName'],
      },
      {
        intentName: 'OUT_OF_SCOPE',
        templateKey: 'REJECT',
        content:
          '죄송합니다. 저는 쇼핑몰의 상품, 주문, 배송 등 쇼핑몰 이용과 관련된 문의만 도와드릴 수 있습니다. 😊',
        variables: [],
      },
      {
        intentName: 'PRODUCT_SEARCH',
        templateKey: 'NOT_FOUND',
        content: '죄송합니다. "{{query}}"에 대한 상품을 찾을 수 없습니다. 다른 키워드로 검색해주세요.',
        variables: ['query'],
      },
      {
        intentName: 'ORDER_STATUS',
        templateKey: 'NEED_LOGIN',
        content: '주문 조회를 위해서는 로그인이 필요합니다. 로그인 후 다시 시도해주세요.',
        variables: [],
      },
    ],
  });

  console.log('✅ Created Chat Templates');

  // Conversation Flows
  const productFlow = await prisma.conversationFlow.create({
    data: {
      name: 'product_recommendation',
      nameKo: '상품 추천',
      description: '사용자 니즈에 맞는 상품 추천',
      type: 'PRODUCT_RECOMMENDATION',
      triggerIntent: 'PRODUCT_SEARCH',
      triggerKeywords: ['추천', '찾아줘', '어떤 제품'],
      startStepId: 'step1',
      steps: {
        create: [
          {
            stepKey: 'ask_purpose',
            message: '어떤 용도로 찾으시나요?',
            messageType: 'QUESTION',
            collectData: 'purpose',
            nextStepLogic: { default: 'ask_budget' },
            order: 1,
          },
          {
            stepKey: 'ask_budget',
            message: '예산은 얼마나 생각하고 계신가요?',
            messageType: 'QUESTION',
            collectData: 'budget',
            nextStepLogic: {
              conditions: [
                { if: 'budget < 50000', then: 'recommend_budget' },
                { if: 'budget >= 50000', then: 'recommend_premium' },
              ],
            },
            order: 2,
          },
          {
            stepKey: 'recommend_budget',
            message: '예산에 맞는 상품을 추천드립니다',
            messageType: 'RECOMMENDATION',
            nextStepLogic: {},
            order: 3,
          },
          {
            stepKey: 'recommend_premium',
            message: '프리미엄 상품을 추천드립니다',
            messageType: 'RECOMMENDATION',
            nextStepLogic: {},
            order: 4,
          },
        ],
      },
    },
  });

  console.log('✅ Created Conversation Flows');

  // Product FAQs
  await prisma.productFaq.createMany({
    data: [
      // 노못 스프링 S사이즈
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 S사이즈의 제품 규격은?',
        answer: `노못 스프링 S사이즈 제품규격:
- 설치사이즈: 100~120mm
- 제품 가로사이즈: 최소 100mm, 최대 125mm (설치가능 길이는 120mm까지)
- 제품 높이: 72mm
- 커튼봉 걸림 높이: 천정면에서 50mm 위치에 커튼봉 중심 위치
- 제품 두께: 35mm
- 실리콘밀착캡 지름: 34mm (힘을 받는 원 중심 지름 20mm 부분은 반드시 커튼박스 벽면과 맞닿아야 함)`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 S사이즈 설치 가능한 길이는?',
        answer: '노못 스프링 S사이즈는 100mm에서 120mm까지 설치 가능합니다. 제품 가로사이즈는 최소 100mm, 최대 125mm이지만, 실제 설치 가능한 길이는 120mm까지입니다.',
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 커튼봉이 걸리는 높이는?',
        answer: '노못 스프링 S사이즈의 세로길이는 72mm이며, 커튼봉이 걸리는 위치는 천정면에서부터 50mm에 커튼봉 중심이 위치하게 됩니다.',
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 실리콘밀착캡 규격은?',
        answer: '실리콘밀착캡 지름은 34mm이며, 힘을 받는 원 중심으로 한 지름 20mm 부분은 반드시 커튼박스의 벽면과 맞닿아 있어야 합니다.',
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 S사이즈의 하중은 얼마나 견디나요?',
        answer: `노못 스프링 S사이즈 하중 정보:
- 개당 하중: 1m당 5kg (설치환경에 따라 상이할 수 있음)
- 실험환경: 10kg까지 하중 가능
- 실제환경 예측: 5kg (가정집 환경 고려)

주의사항: 커튼박스의 시공오차, 커튼의 무게, 벽지의 종류, 설치상태 등의 변수가 많아 정확한 하중은 환경에 따라 달라질 수 있습니다.`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 몇 개를 구매해야 하나요?',
        answer: `노못 스프링 S사이즈 권장 구매 수량:
- 기본 설치 기준: 1m당 1개
- 암막커튼의 경우: 5개 세트 구성 추천

제품 수량은 상세페이지에 안내되어 있는 최소 수량을 꼭 확인하시어 구매해 주시기 바랍니다.

커튼의 종류와 무게에 따라 필요한 수량이 달라질 수 있으니, 설치하실 커튼의 길이와 종류를 고려하여 구매하시기 바랍니다.`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 설치 방법은 어떻게 되나요?',
        answer: `노못 스프링 S사이즈 설치 방법:

1. 호환 커튼봉: 커튼봉 지름 25mm 이하

2. 권장 설치 수량:
   - 일반 커튼: 가로길이 1m당 최소 1개
   - 암막커튼: 1m당 2개 (추가 1개 더 설치 권장)

3. 고정 방법:
   - 제품과 함께 제공되는 고정패드를 사용하세요
   - 커튼봉이 미끄러지지 않도록 고정패드를 추가 부착
   - 안정적인 고정을 위해 고정패드 사용을 강력히 추천합니다

설치 시 주의사항: 커튼박스의 벽면과 실리콘밀착캡이 완전히 밀착되도록 설치해 주시기 바랍니다.`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: 'S사이즈로 130mm 커튼박스에 설치할 수 있나요?',
        answer: `아니요, 노못 스프링 S사이즈는 130mm 커튼박스에 설치할 수 없습니다.

S사이즈의 설치사이즈는 100~120mm이므로, 130mm는 이 범위를 초과합니다.

130mm 커튼박스에는 노못 스프링 M사이즈(설치사이즈 120~160mm)를 사용하셔야 합니다.

M사이즈 제품은 120mm부터 160mm까지의 커튼박스에 설치 가능하므로, 130mm 커튼박스에 적합합니다.`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
      {
        productName: '노못 스프링 S사이즈',
        category: '인테리어/커튼',
        question: 'S사이즈로 90mm 커튼박스에 설치할 수 있나요?',
        answer: `아니요, 노못 스프링 S사이즈는 90mm 커튼박스에 설치할 수 없습니다.

S사이즈의 설치사이즈는 100~120mm이므로, 90mm는 최소값 100mm보다 작아서 설치가 불가능합니다.

90mm처럼 100mm보다 작은 커튼박스에는 현재 노못 스프링 제품군으로는 설치할 수 있는 제품이 없습니다.

커튼박스 크기가 100mm 미만인 경우, 다른 설치 방법을 고려하시거나 고객센터(1588-1234)로 문의해 주시기 바랍니다.`,
        productId: 'NOMOT-SPRING-S',
        isActive: true,
      },
    ],
  });

  // Product FAQs - 노못 스프링 M사이즈
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '노못 스프링 M사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 M사이즈의 제품 규격은?',
        answer: `노못 스프링 M사이즈 제품규격:
- 설치사이즈: 120~160mm
- 제품 가로사이즈: 최소 120mm, 최대 165mm (설치가능 길이는 160mm까지)
- 제품 높이: 85mm (84mm)
- 커튼봉 걸림 높이: 천정면에서 60mm 위치에 커튼봉 중심 위치
- 제품 두께: 35mm
- 실리콘밀착캡 지름: 34mm (힘을 받는 원 중심 지름 20mm 부분은 반드시 커튼박스 벽면과 맞닿아야 함)

참고: 커튼박스가 160mm인 경우 M사이즈로 설치 가능하며, 120mm인 경우 S, M사이즈 모두 설치 가능하나 M사이즈를 추천드립니다.`,
        productId: 'NOMOT-SPRING-M',
        isActive: true,
      },
      {
        productName: '노못 스프링 M사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 M사이즈의 하중은 얼마나 견디나요?',
        answer: `노못 스프링 M사이즈 하중 정보:
- 개당 하중: 1m당 5kg (설치환경에 따라 상이할 수 있음)
- 실험환경: 10kg까지 하중 가능
- 실제환경 예측: 5kg (가정집 환경 고려)

주의사항: 커튼박스의 시공오차, 커튼의 무게, 벽지의 종류, 설치상태 등의 변수가 많아 정확한 하중은 환경에 따라 달라질 수 있습니다.

일반적으로 1m당 1개 설치를 기준으로 안내드리고 있으며, 암막커튼인 경우 5개 세트 구성을 구매하시는 것을 추천드립니다.`,
        productId: 'NOMOT-SPRING-M',
        isActive: true,
      },
      {
        productName: '노못 스프링 M사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 M사이즈 설치 시 필요한 개수는?',
        answer: `노못 스프링 M사이즈 권장 설치 수량:
- 기본: 1m당 1개
- 암막커튼: 5개 세트 구성 추천
- 커튼 가로길이 4m 초과 또는 암막커튼을 커튼봉으로 설치하는 경우: 최소 6개

중요: 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품 설치가 잘 되지 않는 경우가 있으니, 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-SPRING-M',
        isActive: true,
      },
      {
        productName: '노못 스프링 M사이즈',
        category: '인테리어/커튼',
        question: '노못 스프링 M사이즈 설치 방법은?',
        answer: `노못 스프링 M사이즈 설치 방법:

1. 호환 커튼봉: 커튼봉 지름 35mm 이하
   - 지름 25mm 커튼봉 사용 시: 함께 보내드리는 고정패드를 부착하여 사용 가능

2. 권장 커튼봉:
   - 설치길이가 긴 경우: 커튼봉 지름 35mm 제품 사용 권장 (커튼봉이 휘는 것을 방지)
   - 노못스프링 M사이즈와 호환 가능

3. L사이즈 관련:
   - L사이즈는 올라운더 제품으로 구조를 변경하여 출시
   - 설치길이 110~205mm 범위 내에서 설치 가능
   - 커튼레일 전용

설치 시 주의사항: 커튼박스의 벽면과 실리콘밀착캡이 완전히 밀착되도록 설치해 주시기 바랍니다.`,
        productId: 'NOMOT-SPRING-M',
        isActive: true,
      },
    ],
  });

  console.log('✅ Created Product FAQs');

  // Quick Replies
  await prisma.quickReply.createMany({
    data: [
      // Welcome
      {
        category: 'WELCOME',
        triggerOn: 'session_start',
        label: '🚚 배송 조회',
        value: '배송 조회하고 싶어요',
        order: 1,
      },
      {
        category: 'WELCOME',
        triggerOn: 'session_start',
        label: '🔍 상품 찾기',
        value: '상품 추천 받고 싶어요',
        order: 2,
      },
      {
        category: 'WELCOME',
        triggerOn: 'session_start',
        label: '💳 결제 문의',
        value: '결제 관련 문의',
        order: 3,
      },
      {
        category: 'WELCOME',
        triggerOn: 'session_start',
        label: '👤 회원 정보',
        value: '회원 정보 관련 문의',
        order: 4,
      },
      // Contextual - after shipping inquiry
      {
        category: 'CONTEXTUAL',
        triggerOn: 'after_intent:ORDER_STATUS',
        label: '주문 취소하기',
        value: '주문 취소는 어떻게 하나요?',
        order: 1,
      },
      {
        category: 'CONTEXTUAL',
        triggerOn: 'after_intent:ORDER_STATUS',
        label: '배송지 변경',
        value: '배송지 변경 방법 알려주세요',
        order: 2,
      },
    ],
  });

  console.log('✅ Created Quick Replies');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
