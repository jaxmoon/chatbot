import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateHeightConstraints() {
  console.log('🔄 커튼박스 높이 제약사항 업데이트 시작...\n');

  try {
    // 1. 올라운더 제품 업데이트 (2cm)
    const allrounderProducts = await prisma.productFaq.findMany({
      where: {
        productName: {
          contains: '올라운더',
        },
      },
    });

    console.log(`📦 올라운더 제품: ${allrounderProducts.length}개 발견`);

    for (const product of allrounderProducts) {
      if (product.question.includes('규격')) {
        // 이미 높이 제약사항이 추가되어 있는지 확인
        if (product.answer.includes('커튼박스 높이')) {
          console.log(`  ⏭️  ${product.productName} 이미 업데이트됨`);
          continue;
        }

        const updatedAnswer = product.answer + '\n\n※ 커튼박스 높이(깊이) 제약사항: 최소 2cm 이상';

        await prisma.productFaq.update({
          where: { id: product.id },
          data: { answer: updatedAnswer },
        });

        console.log(`  ✅ ${product.productName} 규격 정보 업데이트`);
      }
    }

    // 2. 노타프로 제품 업데이트 (3cm)
    const notaproProducts = await prisma.productFaq.findMany({
      where: {
        productName: {
          contains: '노타프로',
        },
      },
    });

    console.log(`\n📦 노타프로 제품: ${notaproProducts.length}개 발견`);

    for (const product of notaproProducts) {
      if (product.question.includes('규격')) {
        if (product.answer.includes('커튼박스 높이')) {
          console.log(`  ⏭️  ${product.productName} 이미 업데이트됨`);
          continue;
        }

        const updatedAnswer = product.answer + '\n\n※ 커튼박스 높이(깊이) 제약사항: 최소 3cm 이상';

        await prisma.productFaq.update({
          where: { id: product.id },
          data: { answer: updatedAnswer },
        });

        console.log(`  ✅ ${product.productName} 규격 정보 업데이트`);
      }
    }

    // 3. 스프링 S 제품 업데이트 (3.5cm)
    const springSProducts = await prisma.productFaq.findMany({
      where: {
        productName: {
          contains: '스프링 S',
        },
      },
    });

    console.log(`\n📦 스프링 S 제품: ${springSProducts.length}개 발견`);

    for (const product of springSProducts) {
      if (product.question.includes('규격')) {
        if (product.answer.includes('커튼박스 높이')) {
          console.log(`  ⏭️  ${product.productName} 이미 업데이트됨`);
          continue;
        }

        const updatedAnswer = product.answer + '\n\n※ 커튼박스 높이(깊이) 제약사항: 최소 3.5cm 이상';

        await prisma.productFaq.update({
          where: { id: product.id },
          data: { answer: updatedAnswer },
        });

        console.log(`  ✅ ${product.productName} 규격 정보 업데이트`);
      }
    }

    // 4. 스프링 M 제품 업데이트 (3.5cm)
    const springMProducts = await prisma.productFaq.findMany({
      where: {
        productName: {
          contains: '스프링 M',
        },
      },
    });

    console.log(`\n📦 스프링 M 제품: ${springMProducts.length}개 발견`);

    for (const product of springMProducts) {
      if (product.question.includes('규격')) {
        if (product.answer.includes('커튼박스 높이')) {
          console.log(`  ⏭️  ${product.productName} 이미 업데이트됨`);
          continue;
        }

        const updatedAnswer = product.answer + '\n\n※ 커튼박스 높이(깊이) 제약사항: 최소 3.5cm 이상';

        await prisma.productFaq.update({
          where: { id: product.id },
          data: { answer: updatedAnswer },
        });

        console.log(`  ✅ ${product.productName} 규격 정보 업데이트`);
      }
    }

    console.log('\n✅ 커튼박스 높이 제약사항 업데이트 완료!');

  } catch (error) {
    console.error('❌ 업데이트 실패:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateHeightConstraints();
