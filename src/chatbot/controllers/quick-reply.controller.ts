import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { QuickReplyService } from '../services/quick-reply.service';

@ApiTags('Quick Replies')
@Controller('api/quick-replies')
export class QuickReplyController {
  constructor(private readonly quickReplyService: QuickReplyService) {}

  @Get('welcome')
  @ApiOperation({ summary: '환영 퀵 리플라이 조회' })
  @ApiResponse({
    status: 200,
    description: '세션 시작 시 표시할 퀵 리플라이 목록',
  })
  async getWelcomeQuickReplies() {
    return this.quickReplyService.getWelcomeQuickReplies();
  }

  @Get('intent/:intent')
  @ApiOperation({ summary: '의도별 퀵 리플라이 조회' })
  @ApiParam({ name: 'intent', description: '질문 의도' })
  @ApiResponse({
    status: 200,
    description: '특정 의도 후 표시할 퀵 리플라이 목록',
  })
  async getContextualQuickReplies(@Param('intent') intent: string) {
    return this.quickReplyService.getContextualQuickReplies(intent);
  }
}
