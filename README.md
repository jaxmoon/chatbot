# 이커머스 고객 응대 채팅봇 시스템

AI 기반 고객 응대 챗봇으로, 웹사이트에 임베드 가능한 플로팅 위젯을 제공합니다.

## 🎯 핵심 기능

- **FAQ 자동 응답**: 자주 묻는 질문에 대한 즉시 답변
- **상품 스펙 문의**: 상품 정보 및 스펙 안내
- **대화형 컨설턴트**:
  - 상품 추천 가이드
  - 프로세스 안내 (주문, 반품, 교환)
  - 문제 해결 트리
- **동적 퀵 리플라이**: 상황에 맞는 빠른 답변 버튼
- **플로팅 위젯**: 웹사이트 1줄 임베드
- **범위 제한**: 구축된 데이터 내에서만 답변

## 🛠 기술 스택

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **AI**: Claude API (claude-3-5-sonnet-20241022)
- **Real-time**: WebSocket (Socket.io)

### Widget
- **Framework**: Vanilla JS (프레임워크 독립적)
- **Styling**: CSS (Shadow DOM)
- **Build**: Vite

## 📁 프로젝트 구조

```
chatbot/
├── backend/          # NestJS 백엔드
│   ├── src/
│   ├── prisma/
│   └── public/       # 위젯 파일
├── widget/           # 플로팅 위젯
│   ├── src/
│   └── dist/
├── docs/             # 문서
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- PostgreSQL 15
- Claude API Key

### 설치

```bash
# Backend
cd backend
npm install

# Widget
cd widget
npm install
```

### 환경 변수 설정

```bash
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db
CLAUDE_API_KEY=your_api_key_here
PORT=4000
```

### 실행

```bash
# Backend
cd backend
npm run start:dev

# Widget 빌드
cd widget
npm run build
```

## 📚 주요 데이터베이스 테이블

- **ChatSession**: 채팅 세션 관리
- **ChatMessage**: 메시지 저장
- **Faq**: FAQ 항목
- **ConversationFlow**: 대화 흐름 정의
- **QuickReply**: 퀵 리플라이 버튼
- **ProductFaq**: 상품별 FAQ

## 🎨 위젯 임베드

웹사이트 `</body>` 태그 전에 다음 스크립트를 추가:

```html
<script>
  (function(w,d,s,o,f){
    w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    const js=d.createElement(s);
    js.src=f; js.async=1;
    d.body.appendChild(js);
  })(window,document,'script','chatbot','https://yourdomain.com/widget/chatbot.js');

  chatbot('init', {
    apiUrl: 'https://api.yourdomain.com',
    brandName: '쇼핑몰 이름',
    primaryColor: '#E17055'
  });
</script>
```

## 📖 라이선스

MIT
