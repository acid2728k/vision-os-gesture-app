# 📁 GitHub Configuration

Эта директория содержит всю конфигурацию для GitHub репозитория.

## 📂 Структура

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # CI/CD pipeline
│   ├── codeql.yml         # Security analysis
│   ├── dependency-review.yml  # Dependency checks
│   ├── pages.yml          # GitHub Pages deployment
│   ├── release.yml        # Automatic releases
│   └── stale.yml          # Mark stale issues/PRs
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.md
│   └── feature_request.md
├── scripts/                # Utility scripts
│   └── setup-labels.sh    # Setup GitHub labels
├── CODE_OF_CONDUCT.md     # Code of conduct
├── CONTRIBUTING.md        # Contribution guidelines
├── SECURITY.md            # Security policy
├── FUNDING.yml            # Funding configuration
├── labels.json            # Label definitions
└── pull_request_template.md  # PR template
```

## 🚀 GitHub Actions

### CI/CD Pipeline (`ci.yml`)
- Автоматическая проверка кода при каждом push/PR
- Линтинг и сборка проекта
- Сохранение артефактов сборки

### CodeQL Analysis (`codeql.yml`)
- Еженедельный анализ безопасности кода
- Автоматическое сканирование на уязвимости

### Dependency Review (`dependency-review.yml`)
- Проверка зависимостей на уязвимости
- Автоматический review PR с изменениями зависимостей

### GitHub Pages (`pages.yml`)
- Автоматический деплой на GitHub Pages
- Доступно после каждого push в main

### Release (`release.yml`)
- Автоматическое создание релизов при создании тега
- Включение артефактов сборки в релиз

### Stale (`stale.yml`)
- Автоматическое помечание неактивных Issues/PRs
- Закрытие после периода неактивности

## 📝 Templates

### Issue Templates
- **Bug Report** - для сообщений об ошибках
- **Feature Request** - для предложений новых функций

### Pull Request Template
- Стандартизированный формат для PR
- Чеклист для проверки

## 🔧 Настройка

1. **Labels**: Используйте `scripts/setup-labels.sh` для создания labels
2. **Dependabot**: Автоматически настроен через `dependabot.yml`
3. **Security**: Политика безопасности в `SECURITY.md`

## 📚 Документация

- [CONTRIBUTING.md](CONTRIBUTING.md) - Как контрибьютить
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Кодекс поведения
- [SECURITY.md](SECURITY.md) - Политика безопасности

## ✅ Статус

Все workflows активны и готовы к использованию после первого push в репозиторий.

