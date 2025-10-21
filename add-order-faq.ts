import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addOrderMethodFAQs() {
  const faqs = [
    {
      productId: 'GALLERY-CHIFFON-CURTAIN',
      productName: '갤러리 쉬폰커튼',
      category: '인테리어/커튼',
      question: '갤러리 쉬폰커튼은 어떻게 주문하나요?',
      answer: `갤러리 쉬폰커튼 주문 방법:

1. 주문제작 치수 칸에 제품 받길 원하시는 가로X높이 사이즈를 입력해주세요.
2. 원단 종류를 선택해주세요. 많이 비치는 원단, 살짝 비치는 원단 총 2종류가 있습니다.
3. 사이즈 범위를 선택해주세요. 받길 원하시는 가로 사이즈를 선택하시면 됩니다.
4. 모든 주문은 기본 1장 단위로 진행되며 주문하신 가로X높이 사이즈 기준으로 1장입니다.`,
      isActive: true,
    },
    {
      productId: 'COTTON-PANTS-BLACKOUT-CURTAIN',
      productName: '코튼팬츠 암막커튼',
      category: '인테리어/커튼',
      question: '코튼팬츠 암막커튼은 어떻게 주문하나요?',
      answer: `코튼팬츠 암막커튼 주문 방법:

1. 주문제작 치수 칸에 제품 받길 원하시는 가로X높이 사이즈를 입력해주세요.
2. 색상을 입력하세요. 색상은 직접 색상명을 작성하시면 됩니다. 색상명은 상세페이지를 참고 부탁드립니다.
3. 원단 종류를 선택해주세요. 평주름, 나비주름 2가지 스타일이 있습니다.
4. 주문제작 치수가 해당하는 범위의 가로 사이즈를 선택해주세요.
5. 주문제작 치수가 해당하는 범위의 세로 사이즈를 선택해주세요.
6. 모든 주문은 기본 1장 단위로 진행되며 주문하신 가로X높이 사이즈 기준으로 1장입니다.`,
      isActive: true,
    },
    {
      productId: 'TIMELAPSE-BLACKOUT-ROLL-BLIND',
      productName: '타임랩스 암막 롤 블라인드',
      category: '인테리어/블라인드',
      question: '타임랩스 암막 롤 블라인드는 어떻게 주문하나요?',
      answer: `타임랩스 암막 롤 블라인드 주문 방법:

1. 색상을 입력해주세요. 색상은 직접 색상명을 작성하시면 됩니다.
2. 주문 가로 사이즈X세로사이즈를 입력해주세요. 제작을 원하시는 실제 사이즈를 입력하시면 됩니다.
3. 손잡이 방향을 입력해주세요. 창문을 바라봤을 때 기준으로 손잡이가 달리기 원하시는 방향을 입력해주시면 됩니다.
4. 암막률을 선택해주세요. 원하시는 정도의 암막률을 고르시면 됩니다.
5. 가로X세로 사이즈 범위를 선택해주세요. 범위에서 제일 낮은 숫자로 선택하시면 됩니다.
   예를 들어, 가로 100cm~119cm는 100cm를, 가로 120cm~139cm는 120cm를 선택하시면 됩니다.`,
      isActive: true,
    },
    {
      productId: 'CLASSIC-ALUMINUM-BLIND',
      productName: '클래식 알루미늄 블라인드',
      category: '인테리어/블라인드',
      question: '클래식 알루미늄 블라인드는 어떻게 주문하나요?',
      answer: `클래식 알루미늄 블라인드 주문 방법:

1. 색상을 입력해주세요. 색상은 직접 색상명을 작성하시면 됩니다.
2. 주문 가로 사이즈X세로사이즈를 입력해주세요. 제작을 원하시는 실제 사이즈를 입력하시면 됩니다.
3. 손잡이 방향을 입력해주세요. 창문을 바라봤을 때 기준으로 손잡이가 달리기 원하시는 방향을 입력해주시면 됩니다.
4. 광 선택은 무광/반광을 골라주시면 됩니다. 무광/반광이 해당되는 슬랫 종류는 상세페이지에 안내드리고 있습니다.
5. 슬릿 두께를 골라주시면 됩니다. 슬릿 두께는 16mm, 25mm, 35mm 중 선택 가능합니다.
6. 가로X세로 사이즈 범위를 선택해주세요. 범위에서 제일 낮은 숫자로 선택하시면 됩니다.
   예를 들어, 가로 100cm~119cm는 100cm를, 가로 120cm~139cm는 120cm를 선택하시면 됩니다.`,
      isActive: true,
    },
    {
      productId: 'VERTICAL-BLIND',
      productName: '버티컬 블라인드',
      category: '인테리어/블라인드',
      question: '버티컬 블라인드는 어떻게 주문하나요?',
      answer: `버티컬 블라인드 주문 방법:

1. 색상을 입력해주세요. 직접 입력하시면 됩니다.
2. 실측 가로X세로 사이즈를 입력해주세요. 실제로 제작되길 원하시는 사이즈를 입력하시면 됩니다.
3. 개폐방식을 입력해주세요. 개폐방식에 대한 안내는 상세페이지에 있습니다.
4. 가로X세로 사이즈 범위를 선택해주세요. 범위에서 제일 낮은 숫자로 선택하시면 됩니다.
   예를 들어, 가로 100cm~119cm는 100cm를, 가로 120cm~139cm는 120cm를 선택하시면 됩니다.`,
      isActive: true,
    },
  ];

  console.log('Adding order method FAQs...\n');

  for (const faq of faqs) {
    const created = await prisma.productFaq.create({
      data: faq,
    });
    console.log(`✅ Added: ${created.productName}`);
  }

  console.log('\n✅ All order method FAQs added successfully!');

  await prisma.$disconnect();
}

addOrderMethodFAQs().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
