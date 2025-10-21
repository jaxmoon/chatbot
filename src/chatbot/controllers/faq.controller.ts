import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

class UpdateFaqDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@ApiTags('FAQ (Admin)')
@ApiHeader({
  name: 'x-admin-api-key',
  description: '관리자 API 키',
  required: true,
})
@UseGuards(AdminGuard)
@Controller('api/faq')
export class FaqController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('categories')
  @ApiOperation({ summary: 'FAQ 카테고리 목록 조회' })
  @ApiResponse({ status: 200, description: '카테고리 목록' })
  async getCategories() {
    return this.prisma.faqCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { faqs: true },
        },
      },
    });
  }

  @Get()
  @ApiOperation({ summary: 'FAQ 목록 조회 (필터링, 페이지네이션)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'FAQ 목록' })
  async getFaqs(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { keywords: { hasSome: [search] } },
      ];
    }

    const [faqs, total] = await Promise.all([
      this.prisma.faq.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true, nameKo: true },
          },
        },
      }),
      this.prisma.faq.count({ where }),
    ]);

    return {
      data: faqs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'FAQ 생성' })
  @ApiBody({ type: CreateFaqDto })
  @ApiResponse({ status: 201, description: 'FAQ가 생성되었습니다.' })
  async createFaq(@Body(ValidationPipe) dto: CreateFaqDto) {
    return this.prisma.faq.create({
      data: {
        categoryId: dto.categoryId,
        question: dto.question,
        answer: dto.answer,
        keywords: dto.keywords,
        isActive: dto.isActive ?? true,
      },
      include: {
        category: true,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'FAQ 수정' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiBody({ type: UpdateFaqDto })
  @ApiResponse({ status: 200, description: 'FAQ가 수정되었습니다.' })
  async updateFaq(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateFaqDto,
  ) {
    return this.prisma.faq.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'FAQ 삭제 (비활성화)' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: 'FAQ가 삭제되었습니다.' })
  async deleteFaq(@Param('id') id: string) {
    // Soft delete
    return this.prisma.faq.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
