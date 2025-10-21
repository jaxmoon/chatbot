#!/bin/bash

echo "🧪 최종 데이터 범위 검증 테스트"
echo "================================"
echo ""
echo "⚠️  목표: 데이터베이스에 없는 제품은 절대 답변하지 않아야 함"
echo ""

# 테스트 1: 베네시안 블라인드
echo "📝 테스트 1: 베네시안 블라인드 (데이터에 없음)"
echo "---"
SESSION_TOKEN1=$(curl -X POST 'http://localhost:3000/api/chatbot/sessions' -H 'Content-Type: application/json' -d '{}' 2>/dev/null | jq -r '.sessionToken')
RESPONSE1=$(curl -X POST 'http://localhost:3000/api/chatbot/messages' \
  -H 'Content-Type: application/json' \
  -d "{\"sessionToken\": \"$SESSION_TOKEN1\", \"content\": \"베네시안 블라인드 가격 알려줘\"}" \
  2>/dev/null | jq -r '.content')
echo "$RESPONSE1"
echo ""
echo ""

sleep 2

# 테스트 2: 로만 쉐이드 설치
echo "📝 테스트 2: 로만 쉐이드 설치 방법 (데이터에 없음)"
echo "---"
SESSION_TOKEN2=$(curl -X POST 'http://localhost:3000/api/chatbot/sessions' -H 'Content-Type: application/json' -d '{}' 2>/dev/null | jq -r '.sessionToken')
RESPONSE2=$(curl -X POST 'http://localhost:3000/api/chatbot/messages' \
  -H 'Content-Type: application/json' \
  -d "{\"sessionToken\": \"$SESSION_TOKEN2\", \"content\": \"로만 쉐이드 설치 방법 알려줘\"}" \
  2>/dev/null | jq -r '.content')
echo "$RESPONSE2"
echo ""
echo ""

sleep 2

# 테스트 3: 우드 블라인드
echo "📝 테스트 3: 우드 블라인드 (데이터에 없음)"
echo "---"
SESSION_TOKEN3=$(curl -X POST 'http://localhost:3000/api/chatbot/sessions' -H 'Content-Type: application/json' -d '{}' 2>/dev/null | jq -r '.sessionToken')
RESPONSE3=$(curl -X POST 'http://localhost:3000/api/chatbot/messages' \
  -H 'Content-Type: application/json' \
  -d "{\"sessionToken\": \"$SESSION_TOKEN3\", \"content\": \"우드 블라인드 규격 알려줘\"}" \
  2>/dev/null | jq -r '.content')
echo "$RESPONSE3"
echo ""
echo ""

sleep 2

# 테스트 4: 버티칼 블라인드
echo "📝 테스트 4: 버티칼 블라인드 (데이터에 없음)"
echo "---"
SESSION_TOKEN4=$(curl -X POST 'http://localhost:3000/api/chatbot/sessions' -H 'Content-Type: application/json' -d '{}' 2>/dev/null | jq -r '.sessionToken')
RESPONSE4=$(curl -X POST 'http://localhost:3000/api/chatbot/messages' \
  -H 'Content-Type: application/json' \
  -d "{\"sessionToken\": \"$SESSION_TOKEN4\", \"content\": \"버티칼 블라인드 청소 방법\"}" \
  2>/dev/null | jq -r '.content')
echo "$RESPONSE4"
echo ""
echo ""

sleep 2

# 테스트 5: 데이터에 있는 제품 (정상 응답 확인)
echo "📝 테스트 5: 스프링 S (데이터에 있음 - 정상 응답 기대)"
echo "---"
SESSION_TOKEN5=$(curl -X POST 'http://localhost:3000/api/chatbot/sessions' -H 'Content-Type: application/json' -d '{}' 2>/dev/null | jq -r '.sessionToken')
RESPONSE5=$(curl -X POST 'http://localhost:3000/api/chatbot/messages' \
  -H 'Content-Type: application/json' \
  -d "{\"sessionToken\": \"$SESSION_TOKEN5\", \"content\": \"스프링 S 규격 알려줘\"}" \
  2>/dev/null | jq -r '.content')
echo "$RESPONSE5"
echo ""
echo ""

echo "================================"
echo "✅ 테스트 완료"
echo ""
echo "📊 기대 결과:"
echo "   테스트 1-4: '죄송합니다. 해당 제품은 저희가 취급하지 않는 제품입니다.'"
echo "   테스트 5: 스프링 S 규격 정보 제공"
