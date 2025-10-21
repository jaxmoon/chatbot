import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma Client connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Prisma Client disconnected from database');
  }

  /**
   * 트랜잭션 헬퍼 메서드
   */
  async runTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
