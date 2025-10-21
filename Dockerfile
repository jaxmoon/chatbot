# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./
COPY prisma ./prisma/

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Prisma Client 생성
RUN npx prisma generate

# TypeScript 빌드
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production

# Prisma 파일 복사
COPY prisma ./prisma/

# Prisma Client 생성
RUN npx prisma generate

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# 포트 노출
EXPOSE 4000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 실행
CMD ["node", "dist/main.js"]
