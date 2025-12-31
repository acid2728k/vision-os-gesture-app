#!/bin/bash

# Скрипт для создания GitHub репозитория через API
# Использование: ./create-repo-with-api.sh <github-token> <github-username> [repo-name]

set -e

GITHUB_TOKEN=$1
GITHUB_USERNAME=$2
REPO_NAME=${3:-"vision-os-gesture-app"}

if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ Ошибка: Укажите GitHub token и username"
  echo "Использование: ./create-repo-with-api.sh <github-token> <github-username> [repo-name]"
  echo ""
  echo "Как получить токен:"
  echo "1. Перейдите на https://github.com/settings/tokens"
  echo "2. Нажмите 'Generate new token' → 'Generate new token (classic)'"
  echo "3. Название: 'VISION_OS Setup'"
  echo "4. Выберите scope: 'repo' (полный доступ к репозиториям)"
  echo "5. Нажмите 'Generate token' и скопируйте токен"
  exit 1
fi

echo "🚀 Создание GitHub репозитория через API"
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo ""

# Проверка наличия curl
if ! command -v curl &> /dev/null; then
  echo "❌ curl не установлен. Установите curl"
  exit 1
fi

# Проверка наличия git
if ! command -v git &> /dev/null; then
  echo "❌ Git не установлен. Установите Git: https://git-scm.com/"
  exit 1
fi

# Проверка токена (проверяем доступ к API)
echo "🔐 Проверка токена..."
USER_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user)

if echo "$USER_RESPONSE" | grep -q "Bad credentials"; then
  echo "❌ Неверный токен. Проверьте токен и попробуйте снова."
  exit 1
fi

ACTUAL_USERNAME=$(echo "$USER_RESPONSE" | grep -o '"login":"[^"]*' | cut -d'"' -f4)
echo "✅ Токен валиден. Пользователь: $ACTUAL_USERNAME"

if [ "$ACTUAL_USERNAME" != "$GITHUB_USERNAME" ]; then
  echo "⚠️  Внимание: Username в токене ($ACTUAL_USERNAME) не совпадает с указанным ($GITHUB_USERNAME)"
  read -p "Продолжить с $ACTUAL_USERNAME? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
  GITHUB_USERNAME=$ACTUAL_USERNAME
fi

# Проверка существования репозитория
echo "🔍 Проверка существования репозитория..."
REPO_CHECK=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME)

if [ "$REPO_CHECK" = "200" ]; then
  echo "⚠️  Репозиторий $REPO_NAME уже существует!"
  read -p "Продолжить настройку существующего репозитория? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
  REPO_EXISTS=true
else
  REPO_EXISTS=false
fi

# Создание репозитория (если не существует)
if [ "$REPO_EXISTS" = false ]; then
  echo "🔨 Создание репозитория на GitHub..."
  CREATE_RESPONSE=$(curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$REPO_NAME\",
      \"description\": \"VISION_OS v0.9.1 - Neural Interface Terminal for real-time hand gesture recognition\",
      \"private\": false,
      \"has_issues\": true,
      \"has_projects\": true,
      \"has_wiki\": false,
      \"has_downloads\": true,
      \"auto_init\": false
    }" \
    https://api.github.com/user/repos)

  if echo "$CREATE_RESPONSE" | grep -q "name already exists"; then
    echo "⚠️  Репозиторий уже существует (возможно, приватный)"
    REPO_EXISTS=true
  elif echo "$CREATE_RESPONSE" | grep -q "Bad credentials"; then
    echo "❌ Ошибка авторизации. Проверьте токен."
    exit 1
  elif echo "$CREATE_RESPONSE" | grep -q "\"name\""; then
    echo "✅ Репозиторий создан успешно!"
  else
    echo "❌ Ошибка при создании репозитория:"
    echo "$CREATE_RESPONSE"
    exit 1
  fi
fi

# Инициализация git (если еще не инициализирован)
if [ ! -d ".git" ]; then
  echo "📦 Инициализация git репозитория..."
  git init
  echo "✅ Git репозиторий инициализирован"
else
  echo "✅ Git репозиторий уже инициализирован"
fi

# Добавление всех файлов
echo "📝 Добавление файлов..."
git add .

# Создание первого коммита
echo "💾 Создание первого коммита..."
git commit -m "feat: initial commit - VISION_OS v0.9.1 Neural Interface Terminal

- Add React + TypeScript + Vite setup
- Integrate MediaPipe Hands for gesture recognition
- Create all UI components (StatusBar, OpticalSensor, FingerExtension, etc.)
- Add hand tracking and gesture classification
- Setup GitHub Actions workflows (CI/CD, CodeQL, Dependabot)
- Add documentation and contribution guidelines" 2>/dev/null || {
  echo "ℹ️  Коммит не создан (возможно, нет изменений или уже есть коммиты)"
}

# Переименование ветки в main
echo "🌿 Настройка ветки main..."
git branch -M main 2>/dev/null || echo "ℹ️  Ветка уже называется main"

# Добавление remote
echo "🔗 Настройка remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "✅ Remote настроен"

# Обновление README с username
echo "📝 Обновление README с вашим username..."
if [ -f "README.md" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/yourusername/$GITHUB_USERNAME/g" README.md
  else
    # Linux
    sed -i "s/yourusername/$GITHUB_USERNAME/g" README.md
  fi
  echo "✅ README обновлен"
  
  # Добавляем обновленный README в коммит
  git add README.md
  git commit -m "docs: update README with GitHub username" 2>/dev/null || true
fi

# Отправка кода на GitHub
echo "📤 Отправка кода на GitHub..."
git push -u origin main || {
  echo "⚠️  Ошибка при отправке. Попробуйте вручную:"
  echo "   git push -u origin main"
}

# Удаление токена из remote URL (безопасность)
echo "🔒 Удаление токена из remote URL (безопасность)..."
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "✅ Безопасность настроена"

echo ""
echo "✅ Всё готово!"
echo ""
echo "📋 Репозиторий: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🎯 Следующие шаги:"
echo "   1. Проверьте репозиторий на GitHub"
echo "   2. Проверьте GitHub Actions в вкладке 'Actions'"
echo "   3. Создайте первый Release (v0.9.1)"
echo "   4. Добавьте Topics: react, typescript, mediapipe, gesture-recognition"
echo ""
echo "🎉 Удачи с проектом!"

