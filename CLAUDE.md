# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered customer service chatbot system with embeddable floating widget. Supports FAQ responses, product inquiries, and conversational consulting flows.

## Quick Start Commands

### Development with Docker
```bash
make dev              # Start PostgreSQL only (for local backend development)
make up               # Start all services (DB + Backend in Docker)
make down             # Stop all services
make logs             # View Docker logs
```

### Backend Development (Local)
```bash
npm run start:dev     # NestJS watch mode on port 4000
npm run build         # Build production bundle
npm run start:prod    # Run production build
npm run lint          # ESLint with auto-fix
```

### Database Management
```bash
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Create and apply migration
npm run prisma:seed       # Seed database with initial data
npm run prisma:studio     # Open Prisma Studio GUI (port 5555)
```

### Widget Development
```bash
cd src/client
npm run dev           # Vite dev server on port 5173
npm run build         # Build widget to dist/
```

### Widget Deployment
```bash
./build-widget.sh     # Build widget and copy to public/widget/
# OR
make widget          # Same as above
```

## Architecture Overview

### Backend Structure (NestJS)

**Core Module**: `src/chatbot/`
- `chatbot.service.ts` - Main orchestrator for chat logic
- `chatbot.controller.ts` - HTTP endpoints for messages and sessions
- `chatbot.gateway.ts` - WebSocket gateway for real-time chat

**Intent Handling System** (`src/chatbot/handlers/`)
Each handler extends `BaseHandler` and implements domain-specific logic:
- `greeting.handler.ts` - Welcome messages
- `faq.handler.ts` - FAQ lookups with keyword matching
- `product.handler.ts` - Product information queries
- `order.handler.ts` - Order status and tracking
- `return.handler.ts` - Return/exchange processes
- `payment.handler.ts` - Payment inquiries
- `account.handler.ts` - Account management
- `out-of-scope.handler.ts` - Fallback for unsupported queries

**Services** (`src/chatbot/services/`)
- `intent-detector.service.ts` - Pattern matching for user intent classification
- `claude-ai.service.ts` - Claude API integration for AI responses
- `scope-validator.service.ts` - Validates queries are within system scope
- `flow-manager.service.ts` - Manages multi-step conversational flows
- `quick-reply.service.ts` - Dynamic quick reply button generation

**Data Transfer Objects** (`src/chatbot/dto/`)
- `chat-session.dto.ts` - Session creation and management
- `chat-message.dto.ts` - Message payloads with metadata

### Widget Architecture (Vanilla JavaScript)

**Component Structure** (`src/client/src/components/`)
- `FloatingButton.js` - Chat launcher button
- `ChatWindow.js` - Main container with view state management
- `Header.js` - Title bar with navigation controls
- `SessionList.js` - Chat room list with session switching
- `MessageList.js` - Message display with typing indicator
- `MessageBubble.js` - Individual message rendering
- `QuickReplies.js` - Quick reply button rendering
- `InputBox.js` - Message input with send button

**Entry Point**: `src/client/src/index.js`
- `ChatbotWidget` class - Widget initialization and lifecycle
- Shadow DOM for CSS isolation
- Session management (create, load, switch)
- Message handling (send, receive, display)

**Build Configuration**: `src/client/vite.config.js`
- Base path: `/widget/`
- Output: `dist/` directory
- Assets are not inlined for better caching

### Database Schema (Prisma)

**Chat System**
- `ChatSession` - Session management with chat room metadata (title, lastMessageAt, lastMessagePreview)
- `ChatMessage` - Message storage with role (USER/ASSISTANT/SYSTEM)
- `FallbackMessage` - Out-of-scope messages for admin review

**Knowledge Base**
- `Faq` / `FaqCategory` - General FAQ system
- `ProductFaq` - Product-specific FAQ
- `QuestionIntent` - Intent definitions with patterns and handlers
- `ChatTemplate` - Response templates with variables

**Conversational Flows**
- `ConversationFlow` - Multi-step flow definitions (PRODUCT_RECOMMENDATION, PROCESS_GUIDE, TROUBLESHOOTING)
- `FlowStep` - Individual flow steps with branching logic
- `QuickReply` - Dynamic quick reply buttons with trigger conditions

## Key Implementation Patterns

### Intent Detection Flow
1. `intent-detector.service.ts` matches user message against patterns in `QuestionIntent` table
2. Intent name maps to handler class (e.g., "FAQ" → `FaqHandler`)
3. Handler processes message and returns response with optional quick replies
4. If no intent matches, falls back to `OutOfScopeHandler`

### Chat Room Session Management
- Session title auto-generated from first user message (max 50 chars)
- `lastMessagePreview` shows last 100 chars of most recent message
- `lastMessageAt` used for sorting session list
- Sessions loaded with `?limit=20` pagination

### Widget Build & Deployment Process
1. Run `npm run build` in `src/client/` → outputs to `src/client/dist/`
2. Copy `dist/` contents to `public/widget/` directory
3. NestJS serves static files from `public/widget/` at `/widget` route
4. Widget loads from `http://localhost:4000/widget/index.html`

### Claude AI Integration
- Service: `claude-ai.service.ts`
- Model: `claude-3-5-sonnet-20241022`
- Context includes FAQ data and product information
- Scope validation prevents off-topic responses
- Token usage tracked in `ChatMessage.promptTokens` and `completionTokens`

## Environment Configuration

Required environment variables (see `.env.example`):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db
CLAUDE_API_KEY=sk-ant-api03-...
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_API_KEY=your_admin_key
```

## API Endpoints

**Chat APIs**
- `POST /api/chatbot/sessions` - Create new session
- `GET /api/chatbot/sessions?limit=20` - List sessions
- `GET /api/chatbot/sessions/:token/messages` - Load session messages
- `POST /api/chatbot/messages` - Send message

**Admin APIs** (Requires `x-admin-api-key` header)
- `GET /api/chatbot/admin/fallbacks` - List fallback messages
- FAQ management endpoints

**Static Assets**
- `/widget/*` - Widget files served by `@nestjs/serve-static`
- `/api/docs` - Swagger API documentation

## Testing

Widget can be tested by accessing:
- `http://localhost:4000/widget/` - Widget standalone page
- Embed in HTML with script tag (see README.md)

Backend API testing:
- Swagger UI: `http://localhost:4000/api/docs`
- Health check: `GET http://localhost:4000/`

## Notes on Modifying the System

### Adding New Intent Handler
1. Create handler in `src/chatbot/handlers/[name].handler.ts` extending `BaseHandler`
2. Add intent to `QuestionIntent` table via Prisma seed or admin API
3. Export handler in `src/chatbot/handlers/index.ts`
4. Import in `chatbot.service.ts` handler map

### Adding New Widget Component
1. Create component class in `src/client/src/components/`
2. Export in component file
3. Import and initialize in parent component (usually `ChatWindow.js`)
4. Add styles to `src/client/src/styles.css`
5. Rebuild widget with `./build-widget.sh`

### Modifying Database Schema
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migration
3. Update DTOs and services accordingly
4. Rebuild Prisma client with `npm run prisma:generate`
