import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-admin-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('Admin API key is required');
    }

    const adminApiKey = process.env.ADMIN_API_KEY;

    if (!adminApiKey) {
      throw new Error(
        'ADMIN_API_KEY environment variable is not configured',
      );
    }

    if (apiKey !== adminApiKey) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
