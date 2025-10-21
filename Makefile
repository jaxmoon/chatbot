.PHONY: help up down restart logs db-only backend-only build clean seed test widget

help: ## 사용 가능한 명령어 표시
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## 전체 서비스 시작 (DB + Backend)
	docker compose up -d
	@echo "✅ 서비스가 시작되었습니다"
	@echo "📖 Backend API: http://localhost:4000"
	@echo "📖 API Docs: http://localhost:4000/api/docs"

down: ## 전체 서비스 중지
	docker compose down
	@echo "✅ 서비스가 중지되었습니다"

restart: ## 전체 서비스 재시작
	docker compose restart
	@echo "✅ 서비스가 재시작되었습니다"

logs: ## 로그 확인 (Ctrl+C로 종료)
	docker compose logs -f

db-only: ## 데이터베이스만 시작
	docker compose up -d db
	@echo "✅ 데이터베이스가 시작되었습니다"

backend-only: ## Backend만 재시작
	docker compose restart backend
	@echo "✅ Backend가 재시작되었습니다"

build: ## Docker 이미지 다시 빌드
	docker compose build --no-cache
	@echo "✅ Docker 이미지가 빌드되었습니다"

clean: ## 모든 컨테이너, 볼륨, 이미지 삭제
	docker compose down -v
	docker rmi chatbot-backend 2>/dev/null || true
	@echo "✅ 정리가 완료되었습니다"

seed: ## 시드 데이터 실행 (DB가 실행 중이어야 함)
	cd backend && npm run prisma:seed
	@echo "✅ 시드 데이터가 생성되었습니다"

test: ## 테스트 실행 (서버가 실행 중이어야 함)
	cd backend && npx ts-node test-chatbot.ts
	@echo "✅ 테스트가 완료되었습니다"

ps: ## 실행 중인 컨테이너 확인
	docker compose ps

dev: ## 개발 모드 (로컬 서버 + Docker DB)
	docker compose up -d db
	@echo "✅ 데이터베이스가 시작되었습니다"
	@echo "📝 Backend 개발 서버를 실행하려면: npm run start:dev"

widget: ## 위젯 빌드 및 배포
	./build-widget.sh
