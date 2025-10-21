import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotGateway } from './chatbot.gateway';
import { ClaudeAIService } from './services/claude-ai.service';
import { IntentDetectorService } from './services/intent-detector.service';
import { ScopeValidatorService } from './services/scope-validator.service';
import { FlowManagerService } from './services/flow-manager.service';
import { QuickReplyService } from './services/quick-reply.service';
import { QuickReplyController } from './controllers/quick-reply.controller';
import { FaqController } from './controllers/faq.controller';
import { WidgetController } from './controllers/widget.controller';

@Module({
  controllers: [
    ChatbotController,
    QuickReplyController,
    FaqController,
    WidgetController,
  ],
  providers: [
    ChatbotService,
    ChatbotGateway,
    ClaudeAIService,
    IntentDetectorService,
    ScopeValidatorService,
    FlowManagerService,
    QuickReplyService,
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
