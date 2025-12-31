# 🚀 Настройка GitHub репозитория

Этот файл содержит инструкции по настройке GitHub репозитория для проекта VISION_OS.

## 📋 Шаги для создания репозитория

### 1. Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com/new)
2. Создайте новый репозиторий с именем `vision-os-gesture-app`
3. **НЕ** инициализируйте его с README, .gitignore или лицензией (мы уже создали их)
4. Скопируйте URL репозитория (например: `https://github.com/yourusername/vision-os-gesture-app.git`)

### 2. Инициализируйте Git в локальном проекте

Откройте терминал в корневой директории проекта и выполните:

```bash
# Инициализация git
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "feat: initial commit - VISION_OS v0.9.1 Neural Interface Terminal"

# Добавление remote репозитория (замените URL на ваш)
git remote add origin https://github.com/yourusername/vision-os-gesture-app.git

# Переименование ветки в main (если нужно)
git branch -M main

# Отправка в GitHub
git push -u origin main
```

### 3. Настройка GitHub Actions

После первого push, GitHub Actions автоматически активируются:

- ✅ **CI/CD Pipeline** - автоматическая проверка кода при каждом push/PR
- ✅ **Dependency Review** - проверка зависимостей на уязвимости
- ✅ **CodeQL Analysis** - анализ безопасности кода
- ✅ **Dependabot** - автоматические обновления зависимостей

### 4. Настройка репозитория на GitHub

1. Перейдите в **Settings** → **General**
2. Включите **Issues** и **Discussions** (если нужно)
3. В **Features** включите:
   - ✅ Issues
   - ✅ Projects
   - ✅ Wiki (опционально)
   - ✅ Discussions (опционально)

### 5. Обновите README с вашим username

В файле `README.md` замените `yourusername` на ваш GitHub username в:
- Badges (строки со статистикой)
- Ссылках на Issues и Pull Requests

### 6. Создайте первый Release

1. Перейдите в **Releases** → **Create a new release**
2. Tag: `v0.9.1`
3. Title: `VISION_OS v0.9.1 - Initial Release`
4. Описание:
   ```markdown
   ## 🎉 Первый релиз VISION_OS

   ### ✨ Основные возможности:
   - Распознавание жестов в реальном времени
   - Визуализация скелета руки
   - Анализ расширения пальцев
   - Компас ориентации
   - График силы щипка
   - Нейронная карта активности
   - Определение 7 типов жестов
   ```

### 7. Включите GitHub Pages (опционально)

Если хотите разместить демо на GitHub Pages:

1. **Settings** → **Pages**
2. Source: `GitHub Actions`
3. Создайте workflow файл `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: cd frontend && npm ci && npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist
      - uses: actions/deploy-pages@v4
```

### 8. Настройка Topics (теги)

Добавьте теги в репозитории для лучшей видимости:
- `react`
- `typescript`
- `mediapipe`
- `gesture-recognition`
- `computer-vision`
- `hand-tracking`
- `webcam`
- `real-time`

### 9. Создайте Issues для активности

Создайте несколько Issues для начала активности:

1. **Feature Request**: "Добавить поддержку жестов двумя руками"
2. **Enhancement**: "Улучшить точность определения жестов"
3. **Documentation**: "Добавить видео-демо в README"

### 10. Создайте Project Board

1. Перейдите в **Projects** → **New project**
2. Создайте Kanban board с колонками:
   - 📋 Backlog
   - 🔄 In Progress
   - ✅ Done

## ✅ Чеклист после настройки

- [ ] Репозиторий создан и код загружен
- [ ] README обновлен с правильным username
- [ ] GitHub Actions работают (проверьте вкладку Actions)
- [ ] Создан первый Release
- [ ] Добавлены Topics
- [ ] Созданы первые Issues
- [ ] Настроен Project Board
- [ ] Dependabot активен (проверьте вкладку Security)

## 🎯 Дополнительные улучшения

### Badges для README

Добавьте эти badges в начало README (замените `yourusername`):

```markdown
![GitHub Actions](https://github.com/yourusername/vision-os-gesture-app/workflows/CI/badge.svg)
![CodeQL](https://github.com/yourusername/vision-os-gesture-app/workflows/CodeQL%20Analysis/badge.svg)
```

### GitHub Sponsors

Если хотите принимать спонсорскую поддержку, обновите `.github/FUNDING.yml`

## 📚 Полезные ссылки

- [GitHub Docs](https://docs.github.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [GitHub Pages](https://docs.github.com/en/pages)

---

**Готово!** 🎉 Ваш репозиторий настроен и готов к активной разработке!

