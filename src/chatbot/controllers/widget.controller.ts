import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Widget')
@Controller('api/widget')
export class WidgetController {
  @Get('config')
  @ApiOperation({ summary: '위젯 설정 조회' })
  @ApiResponse({
    status: 200,
    description: '위젯 초기화에 필요한 설정',
  })
  async getConfig() {
    return {
      apiUrl: process.env.API_URL || 'http://localhost:4000',
      title: '고객센터',
      subtitle: '무엇을 도와드릴까요?',
      primaryColor: '#E17055',
      welcomeMessage: '안녕하세요! 무엇을 도와드릴까요?',
      features: {
        quickReplies: true,
        fileUpload: false,
        typing: true,
      },
    };
  }
}
