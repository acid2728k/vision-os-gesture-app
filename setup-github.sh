#!/bin/bash

# Скрипт для автоматической настройки GitHub репозитория
# Использование: ./setup-github.sh <github-username> [repo-name]

set -e

GITHUB_USERNAME=$1
REPO_NAME=${2:-"vision-os-gesture-app"}

if [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ Ошибка: Укажите GitHub username"
  echo "Использование: ./setup-github.sh <github-username> [repo-name]"
  exit 1
fi

echo "🚀 Настройка GitHub репозитория для VISION_OS"
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo ""

# Проверка наличия git
if ! command -v git &> /dev/null; then
  echo "❌ Git не установлен. Установите Git: https://git-scm.com/"
  exit 1
fi

# Проверка наличия gh CLI (опционально)
HAS_GH_CLI=false
if command -v gh &> /dev/null; then
  HAS_GH_CLI=true
  echo "✅ GitHub CLI найден"
else
  echo "ℹ️  GitHub CLI не найден (опционально, но рекомендуется)"
  echo "   Установите: brew install gh (Mac) или https://cli.github.com/"
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
- Add documentation and contribution guidelines" || {
  echo "⚠️  Коммит не создан (возможно, нет изменений или уже есть коммиты)"
}

# Переименование ветки в main
echo "🌿 Настройка ветки main..."
git branch -M main 2>/dev/null || echo "ℹ️  Ветка уже называется main"

# Создание репозитория на GitHub (если есть gh CLI)
if [ "$HAS_GH_CLI" = true ]; then
  echo ""
  read -p "Создать репозиторий на GitHub через GitHub CLI? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Создание репозитория на GitHub..."
    gh repo create "$REPO_NAME" \
      --public \
      --description "VISION_OS v0.9.1 - Neural Interface Terminal for real-time hand gesture recognition" \
      --source=. \
      --remote=origin \
      --push || {
      echo "⚠️  Не удалось создать репозиторий через GitHub CLI"
      echo "   Возможные причины:"
      echo "   - Не авторизованы в GitHub CLI (выполните: gh auth login)"
      echo "   - Репозиторий уже существует"
      echo ""
      echo "📋 Создайте репозиторий вручную на https://github.com/new"
      echo "   Затем выполните:"
      echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
      echo "   git push -u origin main"
    }
  else
    echo "📋 Создайте репозиторий вручную на https://github.com/new"
    echo "   Затем выполните:"
    echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   git push -u origin main"
  fi
else
  echo ""
  echo "📋 Создайте репозиторий на GitHub:"
  echo "   1. Перейдите на https://github.com/new"
  echo "   2. Название: $REPO_NAME"
  echo "   3. НЕ инициализируйте с README, .gitignore или лицензией"
  echo "   4. Нажмите 'Create repository'"
  echo ""
  echo "   Затем выполните:"
  echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
  echo "   git push -u origin main"
fi

# Обновление README с username
echo ""
echo "📝 Обновление README с вашим username..."
if [ -f "README.md" ]; then
  # Замена yourusername на реальный username (только в определенных местах)
  sed -i.bak "s/yourusername/$GITHUB_USERNAME/g" README.md 2>/dev/null || \
  sed -i '' "s/yourusername/$GITHUB_USERNAME/g" README.md 2>/dev/null || \
  echo "⚠️  Не удалось обновить README автоматически (обновите вручную)"
  rm -f README.md.bak 2>/dev/null || true
  echo "✅ README обновлен"
fi

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Если репозиторий еще не создан - создайте его на GitHub"
echo "   2. Если remote не добавлен, выполните:"
echo "      git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "   3. Отправьте код:"
echo "      git push -u origin main"
echo "   4. Проверьте GitHub Actions в вкладке 'Actions'"
echo "   5. Создайте первый Release (v0.9.1)"
echo ""
echo "🎉 Готово! Удачи с проектом!"

