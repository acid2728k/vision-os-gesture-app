# PowerShell скрипт для автоматической настройки GitHub репозитория
# Использование: .\setup-github.ps1 -GitHubUsername "your-username" [-RepoName "vision-os-gesture-app"]

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "vision-os-gesture-app"
)

Write-Host "🚀 Настройка GitHub репозитория для VISION_OS" -ForegroundColor Cyan
Write-Host "Username: $GitHubUsername"
Write-Host "Repository: $RepoName"
Write-Host ""

# Проверка наличия git
try {
    $gitVersion = git --version
    Write-Host "✅ Git найден: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git не установлен. Установите Git: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Проверка наличия gh CLI (опционально)
$hasGhCli = $false
try {
    $ghVersion = gh --version
    $hasGhCli = $true
    Write-Host "✅ GitHub CLI найден" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  GitHub CLI не найден (опционально, но рекомендуется)" -ForegroundColor Yellow
    Write-Host "   Установите: winget install GitHub.cli (Windows) или https://cli.github.com/" -ForegroundColor Yellow
}

# Инициализация git (если еще не инициализирован)
if (-not (Test-Path ".git")) {
    Write-Host "📦 Инициализация git репозитория..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git репозиторий инициализирован" -ForegroundColor Green
} else {
    Write-Host "✅ Git репозиторий уже инициализирован" -ForegroundColor Green
}

# Добавление всех файлов
Write-Host "📝 Добавление файлов..." -ForegroundColor Cyan
git add .

# Создание первого коммита
Write-Host "💾 Создание первого коммита..." -ForegroundColor Cyan
$commitMessage = @"
feat: initial commit - VISION_OS v0.9.1 Neural Interface Terminal

- Add React + TypeScript + Vite setup
- Integrate MediaPipe Hands for gesture recognition
- Create all UI components (StatusBar, OpticalSensor, FingerExtension, etc.)
- Add hand tracking and gesture classification
- Setup GitHub Actions workflows (CI/CD, CodeQL, Dependabot)
- Add documentation and contribution guidelines
"@

try {
    git commit -m $commitMessage
    Write-Host "✅ Коммит создан" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Коммит не создан (возможно, нет изменений или уже есть коммиты)" -ForegroundColor Yellow
}

# Переименование ветки в main
Write-Host "🌿 Настройка ветки main..." -ForegroundColor Cyan
try {
    git branch -M main
    Write-Host "✅ Ветка настроена" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Ветка уже называется main" -ForegroundColor Yellow
}

# Создание репозитория на GitHub (если есть gh CLI)
if ($hasGhCli) {
    Write-Host ""
    $createRepo = Read-Host "Создать репозиторий на GitHub через GitHub CLI? (y/n)"
    if ($createRepo -eq "y" -or $createRepo -eq "Y") {
        Write-Host "🔨 Создание репозитория на GitHub..." -ForegroundColor Cyan
        try {
            gh repo create $RepoName `
                --public `
                --description "VISION_OS v0.9.1 - Neural Interface Terminal for real-time hand gesture recognition" `
                --source=. `
                --remote=origin `
                --push
            Write-Host "✅ Репозиторий создан и код отправлен!" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Не удалось создать репозиторий через GitHub CLI" -ForegroundColor Yellow
            Write-Host "   Возможные причины:" -ForegroundColor Yellow
            Write-Host "   - Не авторизованы в GitHub CLI (выполните: gh auth login)" -ForegroundColor Yellow
            Write-Host "   - Репозиторий уже существует" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "📋 Создайте репозиторий вручную на https://github.com/new" -ForegroundColor Cyan
            Write-Host "   Затем выполните:" -ForegroundColor Cyan
            Write-Host "   git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor White
            Write-Host "   git push -u origin main" -ForegroundColor White
        }
    } else {
        Write-Host "📋 Создайте репозиторий вручную на https://github.com/new" -ForegroundColor Cyan
        Write-Host "   Затем выполните:" -ForegroundColor Cyan
        Write-Host "   git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor White
        Write-Host "   git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "📋 Создайте репозиторий на GitHub:" -ForegroundColor Cyan
    Write-Host "   1. Перейдите на https://github.com/new" -ForegroundColor White
    Write-Host "   2. Название: $RepoName" -ForegroundColor White
    Write-Host "   3. НЕ инициализируйте с README, .gitignore или лицензией" -ForegroundColor White
    Write-Host "   4. Нажмите 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "   Затем выполните:" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

# Обновление README с username
Write-Host ""
Write-Host "📝 Обновление README с вашим username..." -ForegroundColor Cyan
if (Test-Path "README.md") {
    try {
        $content = Get-Content "README.md" -Raw
        $content = $content -replace "yourusername", $GitHubUsername
        Set-Content "README.md" -Value $content -NoNewline
        Write-Host "✅ README обновлен" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Не удалось обновить README автоматически (обновите вручную)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Настройка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Если репозиторий еще не создан - создайте его на GitHub" -ForegroundColor White
Write-Host "   2. Если remote не добавлен, выполните:" -ForegroundColor White
Write-Host "      git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor Gray
Write-Host "   3. Отправьте код:" -ForegroundColor White
Write-Host "      git push -u origin main" -ForegroundColor Gray
Write-Host "   4. Проверьте GitHub Actions в вкладке 'Actions'" -ForegroundColor White
Write-Host "   5. Создайте первый Release (v0.9.1)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Готово! Удачи с проектом!" -ForegroundColor Green

