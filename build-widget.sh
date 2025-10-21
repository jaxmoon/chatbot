#!/bin/bash

# Chatbot Widget Build Script
# 위젯을 빌드하고 public 디렉토리에 배포합니다.

echo "🔨 Building widget..."
cd src/client
npm run build

echo "📦 Copying built files to public/widget..."
cd ../..
rm -rf public/widget
cp -r src/client/dist public/widget

echo "🎨 Copying styles.css..."
cp src/client/src/styles.css public/widget/styles.css

echo "✅ Widget build completed!"
echo "📍 Widget available at: http://localhost:3000/widget/"
