import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Patch,
  Query,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto, CreateSessionDto } from './dto';

@ApiTags('Chatbot')
@Controller('api/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('sessions')
  @ApiOperation({ summary: '채팅방 목록 조회' })
  @ApiQuery({ name: 'userId', required: false, description: '사용자 ID로 필터링' })
  @ApiQuery({ name: 'limit', required: false, description: '조회 개수 (기본: 20)' })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
  })
  async getAllSessions(
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatbotService.getAllSessions(userId, limit ? parseInt(limit, 10) : 20);
  }

  @Post('sessions')
  @ApiOperation({ summary: '새 채팅 세션 생성' })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: '세션이 생성되었습니다.',
  })
  async createSession(@Body(ValidationPipe) dto: CreateSessionDto) {
    return this.chatbotService.createSession(dto.userId);
  }

  @Get('sessions/:token')
  @ApiOperation({ summary: '세션 정보 조회' })
  @ApiParam({ name: 'token', description: '세션 토큰' })
  @ApiResponse({
    status: 200,
    description: '세션 정보',
  })
  async getSession(@Param('token') token: string) {
    return this.chatbotService.getSession(token);
  }

  @Delete('sessions/:token')
  @ApiOperation({ summary: '세션 종료' })
  @ApiParam({ name: 'token', description: '세션 토큰' })
  @ApiResponse({
    status: 200,
    description: '세션이 종료되었습니다.',
  })
  async endSession(@Param('token') token: string) {
    return this.chatbotService.endSession(token);
  }

  @Post('messages')
  @ApiOperation({ summary: '메시지 전송 및 응답 받기' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 200,
    description: 'AI 응답',
  })
  async sendMessage(@Body(ValidationPipe) dto: SendMessageDto) {
    return this.chatbotService.processMessage(dto);
  }

  @Get('sessions/:token/messages')
  @ApiOperation({ summary: '세션의 메시지 내역 조회' })
  @ApiParam({ name: 'token', description: '세션 토큰' })
  @ApiResponse({
    status: 200,
    description: '메시지 목록',
  })
  async getMessages(@Param('token') token: string) {
    return this.chatbotService.getSessionMessages(token);
  }

  // Admin Endpoints
  @Get('admin/fallback-messages')
  @ApiOperation({ summary: '[어드민] Fallback 메시지 목록 조회' })
  @ApiQuery({ name: 'isResolved', required: false, type: Boolean })
  @ApiQuery({ name: 'reason', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Fallback 메시지 목록',
  })
  async getFallbackMessages(
    @Query('isResolved') isResolved?: string,
    @Query('reason') reason?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};

    if (isResolved !== undefined) {
      filters.isResolved = isResolved === 'true';
    }
    if (reason) {
      filters.reason = reason;
    }
    if (limit) {
      filters.limit = parseInt(limit, 10);
    }
    if (offset) {
      filters.offset = parseInt(offset, 10);
    }

    return this.chatbotService.getFallbackMessages(filters);
  }

  @Get('admin/fallback-messages/statistics')
  @ApiOperation({ summary: '[어드민] Fallback 메시지 통계' })
  @ApiResponse({
    status: 200,
    description: 'Fallback 메시지 통계',
  })
  async getFallbackStatistics() {
    return this.chatbotService.getFallbackStatistics();
  }

  @Get('admin/fallback-messages/:id')
  @ApiOperation({ summary: '[어드민] Fallback 메시지 상세 조회' })
  @ApiParam({ name: 'id', description: 'Fallback 메시지 ID' })
  @ApiResponse({
    status: 200,
    description: 'Fallback 메시지 상세 정보',
  })
  async getFallbackMessageById(@Param('id') id: string) {
    return this.chatbotService.getFallbackMessageById(id);
  }

  @Patch('admin/fallback-messages/:id/resolve')
  @ApiOperation({ summary: '[어드민] Fallback 메시지 해결 처리' })
  @ApiParam({ name: 'id', description: 'Fallback 메시지 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        adminComment: { type: 'string' },
        resolvedBy: { type: 'string' },
      },
      required: ['adminComment', 'resolvedBy'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Fallback 메시지가 해결되었습니다.',
  })
  async resolveFallbackMessage(
    @Param('id') id: string,
    @Body() body: { adminComment: string; resolvedBy: string },
  ) {
    return this.chatbotService.resolveFallbackMessage(
      id,
      body.adminComment,
      body.resolvedBy,
    );
  }
}
