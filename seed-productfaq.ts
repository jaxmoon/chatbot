import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ProductFaq seed...');

  // Product FAQs - 노못 스프링 S사이즈
  await prisma.productFaq.createMany({
    data: [
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

  // Product FAQs - 노못 올라운더 L사이즈
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈의 제품 규격은?',
        answer: `노못 올라운더 L사이즈 제품규격:
- 설치사이즈: 110~205mm
- 제품 가로사이즈: 최소 110mm, 최대 160mm
- 제품 가로사이즈(연장모듈 추가 시): 최소 160mm, 최대 214mm
- 실리콘 높이: 20mm
- 본체 전체 높이: 45mm

실리콘밀착캡 높이는 20mm이며, 20mm 전면이 반드시 커튼박스의 벽면과 맞닿아 있어야 합니다.

커튼 제작 시 참고:
올라운더 제품의 세로 길이는 45mm로, 커튼 제작 시 [(바닥에서 커튼박스 내 천정 높이) - 45mm]를 주문제작 사이즈로 전달하시면 됩니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈 설치 가능한 범위는?',
        answer: `올라운더 L사이즈는 110mm에서 205mm까지 설치 가능합니다.

- 기본 제품: 110~160mm
- 연장모듈 추가 시: 160~214mm

올라운더 제품은 커튼레일 전용 제품입니다.

주의사항: 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품 설치가 잘 되지 않는 경우가 있으니, 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈의 하중은 얼마나 견디나요?',
        answer: `노못 올라운더 L사이즈 하중 정보:
- 개당 하중: 약 10kg

주의사항: 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 스펙이 상이해질 수 있으니, 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈 몇 개를 구매해야 하나요?',
        answer: `올라운더 L사이즈 권장 구매 수량:

**커튼레일 + 쉬폰커튼**
- 2m 미만: 2개
- 2m 이상 4m 미만: 3개
- 4m 이상 6m 미만: 4개

**커튼레일 + 암막커튼**
- 2m 미만: 2개 (연장모듈 시 3개)
- 2m 이상 3m 미만: 3개 (연장모듈 시 4개)
- 3m 이상 4m 미만: 4개 (연장모듈 시 5개)
- 4m 이상 5m 미만: 5개 (연장모듈 시 6개)

**알루미늄 블라인드**
- 2m 미만: 3개 (연장모듈 시 5개)

**우드블라인드**
- 2m 미만: 5개 (연장모듈 시 6개)

설치환경에 따라 제품 설치가 잘 되지 않는 경우가 있으니 상세페이지의 최소 수량을 꼭 확인하시고, 제품을 먼저 주문하여 설치 테스트 후 커튼을 주문제작해주세요.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈 설치 방법은?',
        answer: `올라운더 L사이즈 설치 방법:

1. 커튼레일이나 블라인드와 함께 제공되는 스냅브라켓을 올라운더 금속 팀에 끼웁니다.

2. 직각방향으로 돌려 십자형태가 되게 하여 고정시킵니다.

3. 설치 완료 후 블라인드의 손잡이를 당겨 반드시 단단히 설치되었는지 확인해주세요.

참고 영상: https://youtube.com/shorts/fVeeuromQ0E?feature=share

커튼봉 설치: 별도 제품과 함께 사용하면 커튼봉용으로도 사용 가능합니다. (제품 수량은 우드블라인드와 동일)`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더는 어떤 제품에 사용하나요?',
        answer: `올라운더 L사이즈는 다음 제품들과 함께 사용 가능합니다:

✅ 커튼레일 (전용)
✅ 쉬폰커튼 + 커튼레일
✅ 암막커튼 + 커튼레일
✅ 알루미늄 블라인드
✅ 우드블라인드
✅ 허니콤보블라인드
✅ 커튼봉 (별도 제품 함께 사용)

올라운더 제품은 커튼레일 전용으로 설계되었으며, 설치 길이 110~205mm 범위 내에서 설치 가능합니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈로 186mm 커튼박스에 설치할 수 있나요?',
        answer: `아니요, 올라운더 L사이즈는 186mm 커튼박스에 설치가 어렵습니다.

올라운더 L사이즈의 설치사이즈는 110~205mm이지만, 186mm는 설치가 어려운 범위입니다.

다만, 제품을 1cm 연장하여 주문제작 형태로는 제작이 가능하며, 출고까지 일주일 정도 소요됩니다.

고객센터(1588-1234)로 문의하시면 주문제작에 대한 자세한 안내를 받으실 수 있습니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '올라운더 L사이즈로 100mm 커튼박스에 설치할 수 있나요?',
        answer: `아니요, 올라운더 L사이즈는 100mm 커튼박스에 설치할 수 없습니다.

올라운더 L사이즈의 최소 설치사이즈는 110mm이므로, 100mm는 이 범위에 미치지 못합니다.

100mm 커튼박스에는 노못 스프링 S사이즈(설치사이즈 100~120mm)를 사용하시는 것을 권장드립니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
      {
        productName: '노못 올라운더 L사이즈',
        category: '인테리어/커튼',
        question: '허니콤보블라인드 설치 시 올라운더 몇 개가 필요한가요?',
        answer: `허니콤보블라인드는 브랜드마다 스펙이 상이하여 정확한 설치 수량을 안내드리기 어렵습니다.

참고 사항:
- 벽면 가로길이(긴 방향)이 127cm인 경우, 최소 3개를 설치해주시면 됩니다.

허니콤보블라인드 제품의 무게와 크기에 따라 필요한 수량이 달라질 수 있으니, 제품을 먼저 주문하여 설치 테스트 후 사용하시는 것을 권장드립니다.`,
        productId: 'NOMOT-ALLAROUNDER-L',
        isActive: true,
      },
    ],
  });

  // Product FAQs - 노타프로
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 제품 규격은?',
        answer: `노타프로 제품규격:
- 설치사이즈: 120~180mm
- 제품 가로사이즈: 120mm, 세로 30mm, 높이 30mm`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 하중 지지력은?',
        answer: `노타프로는 벽지의 종류, 커튼박스의 재질(합판, 석고보드, 공구리)에 따라 경도가 바뀔 수 있으나 통상적으로 10kg 정도를 견딜 수 있습니다.

실험환경에서는 20kg까지 하중을 버틸 수 있으나, 가정집의 환경을 고려하여 실제환경에서의 무게는 보수적으로 계산해주셔야 합니다.

설치 상태에 따라 변수가 많아 정확한 안내가 어려운 점 양해 부탁드립니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로로 알루미늄 블라인드 설치 시 몇 개 필요한가요?',
        answer: `노타프로로 알루미늄블라인드 설치하는 경우:
- 1m 설치 시: 2개
- 추가 1m마다: 1개 추가

예시:
- 2m: 3개 (2 + 1)
- 3m: 4개 (2 + 1 + 1)

안내수량은 가장 경량무게 기준이며, 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품 설치가 잘 되지 않는 경우가 있으니 설치 완료 후 블라인드의 손잡이를 당겨 반드시 단단히 설치되었는지 확인 후 사용해주시기 바랍니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로로 우드형 블라인드 설치 시 몇 개 필요한가요?',
        answer: `노타프로로 우드형 블라인드 설치하는 경우:
- 1m 설치 시: 3개
- 추가 1m마다: 2개 추가

예시:
- 2m: 5개 (3 + 2)
- 3m: 7개 (3 + 2 + 2)

안내수량은 가장 경량무게 기준이며, 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품 설치가 잘 되지 않는 경우가 있으니 설치 완료 후 블라인드의 손잡이를 당겨 반드시 단단히 설치되었는지 확인 후 사용해주시기 바랍니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로로 버티컬 블라인드 설치 시 몇 개 필요한가요?',
        answer: `노타프로로 버티컬 블라인드 설치하는 경우:
- 1m 설치 시: 2개
- 추가 1m마다: 1개 추가

예시:
- 2m: 3개 (2 + 1)
- 3m: 4개 (2 + 1 + 1)

안내수량은 가장 경량무게 기준이며, 설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품 설치가 잘 되지 않는 경우가 있으니 설치 완료 후 블라인드의 손잡이를 당겨 반드시 단단히 설치되었는지 확인 후 사용해주시기 바랍니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 암막커튼 + 커튼레일, 2m 미만 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 2m 미만이고, 암막커튼을 커튼레일로 설치하는 경우:
- 노타프로 최소설치수량: 2개
- 연장모듈 사용 시: 3개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 암막커튼 + 커튼레일, 2~3m 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 2m 이상, 3m 미만이고, 암막커튼을 커튼레일로 설치하는 경우:
- 노타프로 최소설치수량: 3개
- 연장모듈 사용 시: 4개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 암막커튼 + 커튼레일, 3~4m 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 3m 이상, 4m 미만이고, 암막커튼을 커튼레일로 설치하는 경우:
- 노타프로 최소설치수량: 4개
- 연장모듈 사용 시: 5개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 암막커튼 + 커튼레일, 4~5m 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 4m 이상, 5m 미만이고, 암막커튼을 커튼레일로 설치하는 경우:
- 노타프로 최소설치수량: 5개
- 연장모듈 사용 시: 6개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 쉬폰커튼, 2m 미만 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 2m 미만이고, 쉬폰커튼으로 설치하는 경우:
- 노타프로 최소설치수량: 2개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 쉬폰커튼, 2~4m 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 2m 이상, 4m 미만이고, 쉬폰커튼으로 설치하는 경우:
- 노타프로 최소설치수량: 3개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 쉬폰커튼, 4~6m 설치 시 몇 개 필요한가요?',
        answer: `커튼 가로길이가 4m 이상, 6m 미만이고, 쉬폰커튼으로 설치하는 경우:
- 노타프로 최소설치수량: 4개

설치환경(커튼박스의 수직도, 합판의 강도 등)에 따라 제품설치가 잘 되지 않는 경우가 있으니 제품을 먼저 주문하여 설치해보시고 튼튼히 설치되는 것이 확인된 다음 커튼을 주문제작해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '커튼박스 안쪽 너비가 180mm 이상이면 노타프로 설치 가능한가요?',
        answer: `아쉽게도 커튼박스 안쪽 너비가 180mm 이상인 경우 노타프로 설치는 어렵습니다.

대안:
- 노못 올라운더 제품은 커튼박스 안쪽 너비 110~205mm 범위 내에서 설치 가능합니다.

노못 올라운더를 고려해주시기 바랍니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로 이중레일 설치 가능한가요?',
        answer: `네, 노타프로는 이중레일 설치가 가능합니다.

필요 사항:
- 제품 추가구성품에 파츠키트를 제품 개수와 동일하게 추가로 주문해주시면 됩니다.
- 브라켓에 끼울 수 있는 볼트와 너트는 노타프로 상품 1개당 2개씩 기본 제공됩니다.

주의사항:
- 노타프로 제품구성에 커튼레일 스냅브라켓, 커튼봉브라켓이 포함되어 있지 않습니다. 브라켓은 별도 준비해주셔야 합니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
      {
        productName: '노타프로',
        category: '인테리어/커튼',
        question: '노타프로는 어떤 제품인가요?',
        answer: `노타프로는 전문가용 제품입니다.

특징:
- 공구 사용 등이 미숙하실 경우 직접 설치 및 사용 상에 조금 불편함이 있을 수 있습니다.
- 노못 올라운더 제품은 간단하게 설치가 가능한 프리미엄 모델입니다.

일반 사용자의 경우 노못 올라운더 제품을 추천드립니다.`,
        productId: 'NOMOT-NOTAPRO',
        isActive: true,
      },
    ],
  });

  // Product FAQs - 커튼레일
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '커튼레일 길이별 제공 브라켓과 레일고리 개수는?',
        answer: `커튼레일 길이별 제공 브라켓과 레일고리 개수:

6자 (90~180cm):
- 브라켓: 대2소1
- 레일고리: 21개

8자 (120~240cm):
- 브라켓: 대2소2
- 레일고리: 28개

10자 (150~300cm):
- 브라켓: 대3소2
- 레일고리: 35개

12자 (180~360cm):
- 브라켓: 대3소3
- 레일고리: 42개

14자 (210~420cm):
- 브라켓: 대4소3
- 레일고리: 49개

16자 (250~480cm):
- 브라켓: 대4소4
- 레일고리: 56개`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '레일고리를 거는 홈의 사이즈는?',
        answer: `레일고리를 거는 홈의 사이즈는 기본레일 기준 약 6mm입니다.`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '커튼레일 구매 시 제공되는 구성품은?',
        answer: `커튼레일 구매 시 제공 구성품:
- 기본 커튼레일
- 스냅브라켓
- 기본나사

모든 구성품이 포함되어 있어 바로 설치 가능합니다.`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '커튼레일 150-300 옵션의 브라켓 개수는?',
        answer: `커튼레일 150-300cm 옵션 구매 시:
- 제공되는 브라켓 개수: 총 5개 (대3소2)
- 레일고리: 35개

스냅브라켓 별도 구매는 현재 진행하고 있지 않으나, 구매 후 재문의 주시면 도움드릴 수 있는 방법을 체크해보도록 하겠습니다.`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '커튼 설치 가로사이즈가 385cm인 경우 어떤 옵션을 선택해야 하나요?',
        answer: `커튼 설치 가로사이즈가 385cm인 경우 선택 가능한 옵션:

1. 210-420cm 옵션
   - 포함된 스냅브라켓: 7개 (대4소3)
   - 레일고리: 49개

2. 250-480cm 옵션
   - 포함된 스냅브라켓: 8개 (대4소4)
   - 레일고리: 56개

두 옵션 중 선택하시면 됩니다.`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '커튼 세로길이(높이)는 어떻게 계산하나요?',
        answer: `제품별 커튼 세로길이(높이) 계산법:

각 제품을 같이 구매 했을 시 구매한 세로 길이에서 해당 높이를 제외하세요:

- 노타프로만 구매 시: -3cm
- 올라운더만 구매 시: -4.5cm
- 커튼레일만 구매 시: -3.5cm
- 노타프로 + 커튼레일 구매 시: -6.5cm
- 올라운더 + 커튼레일 구매 시: -8cm

예시:
천장 높이가 250cm이고 올라운더 + 커튼레일을 구매하는 경우
→ 커튼 세로길이: 250cm - 8cm = 242cm`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '90~180cm 커튼레일의 레일고리 개수는?',
        answer: `커튼레일 90cm~180cm (6자) 옵션 구매 시:
- 제공되는 레일고리 개수: 21개
- 브라켓: 대2소1`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '120~240cm 커튼레일의 레일고리 개수는?',
        answer: `커튼레일 120cm~240cm (8자) 옵션 구매 시:
- 제공되는 레일고리 개수: 28개
- 브라켓: 대2소2`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '180~360cm 커튼레일의 레일고리 개수는?',
        answer: `커튼레일 180cm~360cm (12자) 옵션 구매 시:
- 제공되는 레일고리 개수: 42개
- 브라켓: 대3소3`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '210~420cm 커튼레일의 레일고리 개수는?',
        answer: `커튼레일 210cm~420cm (14자) 옵션 구매 시:
- 제공되는 레일고리 개수: 49개
- 브라켓: 대4소3`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
      {
        productName: '커튼레일',
        category: '인테리어/커튼',
        question: '250~480cm 커튼레일의 레일고리 개수는?',
        answer: `커튼레일 250cm~480cm (16자) 옵션 구매 시:
- 제공되는 레일고리 개수: 56개
- 브라켓: 대4소4`,
        productId: 'NOMOT-CURTAIN-RAIL',
        isActive: true,
      },
    ],
  });

  // Product FAQs - 쉬폰커튼
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 원단 종류는?',
        answer: `쉬폰커튼 원단 종류:

1. 차르르 커튼
   - 특징: 많이 비치는 정도
   - 더 투명하고 가벼운 느낌

2. 밀크쉬폰 커튼
   - 특징: 살짝 비치는 정도
   - 적당한 프라이버시 확보`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 제작 치수는 어떻게 측정하나요?',
        answer: `쉬폰커튼 제작 치수 측정 방법:

1. 실제 설치하시려는 공간의 가로 × 높이 사이즈를 실측하여 주문해주시면 됩니다.

2. 주의사항:
   - 1장 기준의 옵션입니다.
   - 양쪽으로 설치하시는 경우 개수를 2개로 설정하여 주문해주세요.

예시:
- 한쪽만 설치: 개수 1개
- 양쪽 설치: 개수 2개`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 높이 계산은 어떻게 하나요?',
        answer: `쉬폰커튼 높이 계산법:

제품별 높이:
- 커튼레일: 3.5cm
- 노타프로: 3cm
- 올라운더: 4.5cm

주문 품목에 따라 커튼 높이에서 제품 높이를 빼야 합니다.

예시:
높이 220cm, 쉬폰커튼 + 노타프로 + 커튼레일 주문 시
→ 220cm - 3cm (노타프로) - 3.5cm (커튼레일) = 213.5cm로 발주

계산 공식:
- 커튼 높이 = 천장/벽 높이 - 노타프로/올라운더 높이 - 커튼레일 높이(해당 시)`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 + 스프링 몇 개 필요한가요?',
        answer: `쉬폰커튼 + 노못 스프링 설치 시 필요 개수:

- 2m 이하: 2개
- 2m 초과 ~ 3m 이하: 3개
- 3m 초과: 4개

예시:
- 1.5m: 2개
- 2.8m: 3개
- 3.5m: 4개`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 + 올라운더 기본형 몇 개 필요한가요?',
        answer: `쉬폰커튼 + 올라운더 기본형 설치 시 필요 개수:

기본:
- 2m: 2개

추가:
- 추가 2m마다 1개 추가

예시:
- 2m: 2개
- 4m: 3개 (2개 + 1개)
- 6m: 4개 (2개 + 1개 + 1개)`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 + 올라운더 확장형 몇 개 필요한가요?',
        answer: `쉬폰커튼 + 올라운더 확장형 설치 시 필요 개수:

기본:
- 2m: 2개

추가:
- 추가 2m마다 1개 추가

예시:
- 2m: 2개
- 4m: 3개 (2개 + 1개)
- 6m: 4개 (2개 + 1개 + 1개)`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
      {
        productName: '쉬폰커튼',
        category: '인테리어/커튼',
        question: '쉬폰커튼 + 노타프로 몇 개 필요한가요?',
        answer: `쉬폰커튼 + 노타프로 설치 시 필요 개수:

기본:
- 2m: 2개

추가:
- 추가 2m마다 1개 추가

예시:
- 2m: 2개
- 4m: 3개 (2개 + 1개)
- 6m: 4개 (2개 + 1개 + 1개)`,
        productId: 'NOMOT-SHIFFON-CURTAIN',
        isActive: true,
      },
    ],
  });

  // Product FAQs - 롤스크린
  await prisma.productFaq.createMany({
    data: [
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 제품 구성품은?',
        answer: `노못 롤스크린 구매 시 제공되는 구성품:

1. 롤스크린 블라인드 (원단 포함)
2. 기본나사
3. 기본스냅브라켓

모든 구성품이 기본으로 제공되어 별도 구매 없이 바로 설치 가능합니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 원단 종류와 암막률은?',
        answer: `롤스크린 원단은 암막률에 따라 4가지로 구분됩니다:

1. Natural Cloud 10%
   - 가장 밝은 원단
   - 채광 중시

2. Natural Haze 30%
   - 적당한 밝기
   - 채광과 차광 균형

3. Natural Mist 70%
   - 적당한 차광
   - 프라이버시 보호 우수

4. Natural Rain 95%
   - 완전 암막
   - 가장 암막효과 뛰어남

💡 참고: 일반적으로 화이트보다 블랙 컬러가 암막 효과가 더 좋습니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 색상 옵션은?',
        answer: `롤스크린 색상은 시간대로 표현되는 무채색 계열입니다:

1. 오전 7:00 - 밝고 깔끔한 느낌
2. 오전 9:00 - 아늑한 아이보리 톤
3. 오후 2:00
4. 오후 6:00
5. 오후 10:00
6. 오후 12:00 (가장 어두운 색상)

원단의 컬러별로 암막률이 조금씩 상이할 수 있으며, 상세페이지에서 컬러감을 확인하실 수 있습니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 설치 높이 계산 방법은?',
        answer: `롤스크린 설치 높이 계산 시 고려사항:

필요한 여유 높이:
- 브라켓 설치 길이: 4cm
- 블라인드 상단바 높이: 2.5cm
- 총 설치 높이: 6.5cm

계산 예시:
커튼박스 천장에서 창문 하단까지 총 길이가 127cm인 경우
→ 127cm - 6.5cm = 120.5cm
→ 블라인드 높이 120cm 주문 가능

💡 팁: 딱 맞는 치수인 경우 조금 넉넉하게 주문하는 것을 추천합니다.
예: 120cm 대신 140cm 주문`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 사이즈 여유분은 얼마나 필요한가요?',
        answer: `롤스크린 사이즈 여유분 권장사항:

가로 사이즈:
- 양쪽 5cm씩 여유 (총 10cm 길게)
- 암막 효과를 위해 햇빛 차단 필요

세로 사이즈:
- 10cm 정도 길게
- 창문 하단까지 충분히 가릴 수 있도록

예시:
창문 실제 크기가 100cm × 150cm인 경우
→ 주문 사이즈: 110cm × 160cm 권장`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 원단 추천 (용도별)',
        answer: `용도별 롤스크린 원단 추천:

🎬 영화 감상이 잦은 거실:
→ Rain 원단 (95% 암막) 추천

🏠 프라이버시 보호 + 적당한 밝기:
→ Mist 원단 (70% 암막) 추천
→ 앞 동이 있거나 프라이버시 필요한 경우 최적

☀️ 채광 중시:
→ Cloud 원단 (10% 암막) 또는 Haze 원단 (30% 암막)

💡 개인 추천: 암막까지 필요없다면 적당히 햇빛을 가려주면서도 어둡지 않은 Mist 원단을 추천드립니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 컬러 선택 가이드 (바닥 재질별)',
        answer: `바닥 재질에 따른 롤스크린 컬러 추천:

🪵 우드 마루바닥:
→ 7am (밝고 깔끔) 추천
→ 11am 추천

⬜ 화이트 계열 장판:
→ 2pm 추천
→ 6pm 추천

🎨 분위기별 선택:
- 밝고 깔끔한 느낌: 7am
- 아늑한 아이보리 톤: 9am

바닥 재질과 조화를 이루는 컬러를 선택하면 전체적인 인테리어 통일감이 좋습니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: '롤스크린 손잡이 방향은?',
        answer: `롤스크린 손잡이 방향 선택:

옵션:
- 좌 (왼쪽)
- 우 (오른쪽)

선택 가이드:
- 설치 위치와 사용 편의성을 고려하여 선택
- 창문 옆 공간이 넓은 쪽으로 손잡이 배치 권장
- 주로 사용하는 손에 따라 선택 (오른손잡이 → 우측 손잡이가 편리)`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: 'Rain 원단의 특징은?',
        answer: `Rain 원단 (95% 암막) 특징:

✅ 장점:
- 가장 암막효과가 뛰어남 (95%)
- 완전 차광 필요한 공간에 최적
- 영화 감상, 수면 공간에 적합
- 모든 시간 옵션(7am~12pm)의 암막률이 거의 유사

💡 추천 용도:
- 거실에서 영화를 자주 보는 경우
- 완전한 암막이 필요한 침실
- 외부 빛 차단이 중요한 공간

참고: 화이트보다 블랙 컬러가 암막 효과가 더 우수합니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
      {
        productName: '롤스크린',
        category: '인테리어/블라인드',
        question: 'Mist 원단은 언제 사용하나요?',
        answer: `Mist 원단 (70% 암막) 추천 상황:

✅ 최적 사용 환경:
- 암막까지 필요 없는 경우
- 적당히 햇빛을 가려주면서도 어둡지 않게
- 프라이버시 보호가 필요한 경우
- 앞 동이 있는 경우

✅ 장점:
- 적당한 차광과 채광의 균형
- 낮에도 실내가 너무 어둡지 않음
- 외부에서 내부가 잘 보이지 않음
- 가장 많이 선택하는 원단

💡 개인 추천: 완전 암막이 필요하지 않다면 Mist 원단을 가장 추천드립니다.`,
        productId: 'NOMOT-ROLLSCREEN',
        isActive: true,
      },
    ],
  });

  // Product FAQs - C자 알루미늄 블라인드
  await prisma.productFaq.createMany({
    data: [
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드란?',
        answer: `C자 알루미늄 블라인드는 알루미늄 슬랫이 C자 형태로 되어 있는 블라인드입니다.

특징:
- 가벼운 알루미늄 재질
- C자 형태의 슬랫 구조
- 내구성이 우수
- 다양한 색상 선택 가능

설치 방법:
- 노못 스프링: 설치 불가능
- 올라운더 기본형/확장형: 설치 가능
- 노타프로: 설치 가능`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드는 스프링으로 설치 가능한가요?',
        answer: `아니요, C자 알루미늄 블라인드는 노못 스프링으로 설치할 수 없습니다.

설치 불가능한 이유:
- C자 알루미늄 블라인드의 무게와 구조적 특성상 스프링의 하중 지지력으로는 안정적인 설치가 어렵습니다.

대신 사용 가능한 제품:
1. 올라운더 기본형
2. 올라운더 확장형
3. 노타프로

이 제품들은 C자 알루미늄 블라인드의 무게를 안정적으로 지지할 수 있습니다.`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드 + 올라운더 기본형 몇 개 필요한가요?',
        answer: `C자 알루미늄 블라인드 + 올라운더 기본형 설치 시 필요 개수:

기본:
- 1m: 2개

추가:
- 추가 1m마다 1개 추가

예시:
- 1m: 2개
- 2m: 3개 (2개 + 1개)
- 3m: 4개 (2개 + 1개 + 1개)
- 4m: 5개 (2개 + 1개 + 1개 + 1개)

올라운더 기본형은 C자 알루미늄 블라인드의 무게를 안정적으로 지지할 수 있습니다.`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드 + 올라운더 확장형 몇 개 필요한가요?',
        answer: `C자 알루미늄 블라인드 + 올라운더 확장형 설치 시 필요 개수:

기본:
- 1m: 3개

추가:
- 추가 1m마다 2개 추가

예시:
- 1m: 3개
- 2m: 5개 (3개 + 2개)
- 3m: 7개 (3개 + 2개 + 2개)
- 4m: 9개 (3개 + 2개 + 2개 + 2개)

올라운더 확장형은 더 많은 지지점을 제공하여 무거운 블라인드도 안정적으로 설치할 수 있습니다.`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드 + 노타프로 몇 개 필요한가요?',
        answer: `C자 알루미늄 블라인드 + 노타프로 설치 시 필요 개수:

기본:
- 1m: 2개

추가:
- 추가 1m마다 1개 추가

예시:
- 1m: 2개
- 2m: 3개 (2개 + 1개)
- 3m: 4개 (2개 + 1개 + 1개)
- 4m: 5개 (2개 + 1개 + 1개 + 1개)

노타프로는 C자 알루미늄 블라인드의 무게를 안정적으로 지지할 수 있으며, 설치 환경에 따라 제품 설치가 잘 되지 않는 경우가 있으니 설치 완료 후 블라인드의 손잡이를 당겨 반드시 단단히 설치되었는지 확인 후 사용해주시기 바랍니다.`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
      {
        productName: 'C자 알루미늄 블라인드',
        category: '인테리어/블라인드',
        question: 'C자 알루미늄 블라인드 3m에는 어떤 제품을 몇 개 사야 하나요?',
        answer: `C자 알루미늄 블라인드 3m 설치 시 제품별 필요 개수:

1. 올라운더 기본형:
   - 4개 필요 (2개 + 1개 + 1개)

2. 올라운더 확장형:
   - 7개 필요 (3개 + 2개 + 2개)
   - 더 안정적인 설치 원하는 경우 추천

3. 노타프로:
   - 4개 필요 (2개 + 1개 + 1개)

⚠️ 주의: 노못 스프링은 C자 알루미늄 블라인드 설치에 사용할 수 없습니다.

추천:
- 일반적인 경우: 올라운더 기본형 또는 노타프로
- 더 안정적인 설치 원하는 경우: 올라운더 확장형`,
        productId: 'NOMOT-C-ALUMINUM-BLIND',
        isActive: true,
      },
    ],
  });

  console.log('✅ Created Product FAQs');
  console.log('🎉 ProductFaq seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
