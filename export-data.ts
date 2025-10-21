import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  const exportDir = path.join(__dirname, 'exports');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  try {
    // Export all tables
    const data = {
      chatSessions: await prisma.chatSession.findMany({
        include: {
          messages: true,
          fallbackMessages: true,
        },
      }),
      faqCategories: await prisma.faqCategory.findMany({
        include: {
          faqs: true,
        },
      }),
      questionIntents: await prisma.questionIntent.findMany(),
      chatTemplates: await prisma.chatTemplate.findMany(),
      productFaqs: await prisma.productFaq.findMany(),
      conversationFlows: await prisma.conversationFlow.findMany({
        include: {
          steps: true,
        },
      }),
      quickReplies: await prisma.quickReply.findMany(),
    };

    // Write to JSON file
    const jsonPath = path.join(exportDir, `chatbot_data_${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    console.log(`✅ Data exported successfully!`);
    console.log(`📁 JSON: ${jsonPath}`);
    console.log(`\n📊 Export Summary:`);
    console.log(`   Chat Sessions: ${data.chatSessions.length}`);
    console.log(`   Messages: ${data.chatSessions.reduce((sum, s) => sum + s.messages.length, 0)}`);
    console.log(`   FAQ Categories: ${data.faqCategories.length}`);
    console.log(`   FAQs: ${data.faqCategories.reduce((sum, c) => sum + c.faqs.length, 0)}`);
    console.log(`   Question Intents: ${data.questionIntents.length}`);
    console.log(`   Chat Templates: ${data.chatTemplates.length}`);
    console.log(`   Product FAQs: ${data.productFaqs.length}`);
    console.log(`   Conversation Flows: ${data.conversationFlows.length}`);
    console.log(`   Flow Steps: ${data.conversationFlows.reduce((sum, f) => sum + f.steps.length, 0)}`);
    console.log(`   Quick Replies: ${data.quickReplies.length}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
