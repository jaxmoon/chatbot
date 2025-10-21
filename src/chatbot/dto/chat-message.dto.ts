import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsString()
  @IsNotEmpty()
  sessionToken: string;
}

export class ChatMessageResponseDto {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  metadata?: any;
  createdAt: Date;
  quickReplies?: QuickReplyDto[];
}

export class QuickReplyDto {
  id: string;
  label: string;
  value: string;
  icon?: string;
}
