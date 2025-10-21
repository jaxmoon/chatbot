import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

interface SessionInfo {
  socketId: string;
  sessionToken: string;
  lastActivity: Date;
}

@WebSocketGateway({
  cors: {
    origin:
      process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()) ||
      '*',
    credentials: true,
  },
  namespace: '/chatbot',
})
export class ChatbotGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatbotGateway.name);
  private sessionMap = new Map<string, SessionInfo>(); // socketId -> SessionInfo
  private cleanupInterval: NodeJS.Timeout;
  private readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30분
  private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5분

  constructor(private readonly chatbotService: ChatbotService) {}

  onModuleInit() {
    // 주기적으로 비활성 세션 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveSessions();
    }, this.CLEANUP_INTERVAL_MS);
    this.logger.log('WebSocket gateway initialized with cleanup interval');
  }

  onModuleDestroy() {
    // 정리 작업
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessionMap.clear();
    this.logger.log('WebSocket gateway destroyed and cleaned up');
  }

  private cleanupInactiveSessions() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [socketId, sessionInfo] of this.sessionMap.entries()) {
      const inactiveTime = now.getTime() - sessionInfo.lastActivity.getTime();
      if (inactiveTime > this.SESSION_TIMEOUT_MS) {
        this.sessionMap.delete(socketId);
        cleanedCount++;
        this.logger.log(
          `Cleaned up inactive session: ${sessionInfo.sessionToken} (inactive for ${Math.round(inactiveTime / 1000 / 60)} minutes)`,
        );
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(
        `Cleaned up ${cleanedCount} inactive sessions. Active sessions: ${this.sessionMap.size}`,
      );
    }
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // 세션 토큰 확인
    const sessionToken = client.handshake.auth.sessionToken;
    if (sessionToken) {
      this.sessionMap.set(client.id, {
        socketId: client.id,
        sessionToken,
        lastActivity: new Date(),
      });
      this.logger.log(
        `Session ${sessionToken} connected via ${client.id}. Active sessions: ${this.sessionMap.size}`,
      );
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const sessionInfo = this.sessionMap.get(client.id);
    this.sessionMap.delete(client.id);

    if (sessionInfo) {
      this.logger.log(
        `Session ${sessionInfo.sessionToken} disconnected. Active sessions: ${this.sessionMap.size}`,
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; sessionToken: string },
  ) {
    this.logger.log(`Message received from ${client.id}: ${data.content}`);

    // 세션 활동 시간 업데이트
    const sessionInfo = this.sessionMap.get(client.id);
    if (sessionInfo) {
      sessionInfo.lastActivity = new Date();
    }

    try {
      // 타이핑 인디케이터 시작
      client.emit('typing', { isTyping: true });

      // 메시지 처리
      const response = await this.chatbotService.processMessage({
        content: data.content,
        sessionToken: data.sessionToken,
      });

      // 타이핑 인디케이터 종료
      client.emit('typing', { isTyping: false });

      // 응답 전송
      client.emit('response', response);

      // 퀵 리플라이가 있으면 전송
      if (response.quickReplies && response.quickReplies.length > 0) {
        client.emit('quick_replies', {
          quickReplies: response.quickReplies,
        });
      }
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      client.emit('error', {
        message: '메시지 처리 중 오류가 발생했습니다.',
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { isTyping: boolean },
  ) {
    // 타이핑 상태를 브로드캐스트 (필요시)
    // 현재는 서버에서 처리하지 않음
  }

  // 특정 세션에 메시지 전송 (관리자 기능 등에서 사용)
  sendToSession(sessionToken: string, event: string, data: any) {
    for (const [socketId, sessionInfo] of this.sessionMap.entries()) {
      if (sessionInfo.sessionToken === sessionToken) {
        this.server.to(socketId).emit(event, data);
        // 활동 시간 업데이트
        sessionInfo.lastActivity = new Date();
      }
    }
  }

  // 전체 브로드캐스트 (공지사항 등)
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
