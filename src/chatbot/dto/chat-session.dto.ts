import { IsString, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsOptional()
  userId?: string;
}

export class SessionResponseDto {
  sessionToken: string;
  status: 'ACTIVE' | 'ENDED' | 'TRANSFERRED';
  createdAt: Date;
  quickReplies?: any[];
}
