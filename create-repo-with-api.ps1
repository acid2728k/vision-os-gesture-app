# PowerShell скрипт для создания GitHub репозитория через API
# Использование: .\create-repo-with-api.ps1 -GitHubToken "your-token" -GitHubUsername "your-username" [-RepoName "vision-os-gesture-app"]

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "vision-os-gesture-app"
)

Write-Host "🚀 Создание GitHub репозитория через API" -ForegroundColor Cyan
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

# Проверка токена
Write-Host "🔐 Проверка токена..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "VISION-OS-Setup"
}

try {
    $userResponse = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -Method Get
    $actualUsername = $userResponse.login
    Write-Host "✅ Токен валиден. Пользователь: $actualUsername" -ForegroundColor Green
    
    if ($actualUsername -ne $GitHubUsername) {
        Write-Host "⚠️  Внимание: Username в токене ($actualUsername) не совпадает с указанным ($GitHubUsername)" -ForegroundColor Yellow
        $continue = Read-Host "Продолжить с $actualUsername? (y/n)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 1
        }
        $GitHubUsername = $actualUsername
    }
} catch {
    Write-Host "❌ Ошибка проверки токена: $_" -ForegroundColor Red
    Write-Host "Проверьте токен и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Проверка существования репозитория
Write-Host "🔍 Проверка существования репозитория..." -ForegroundColor Cyan
try {
    $repoCheck = Invoke-RestMethod -Uri "https://api.github.com/repos/$GitHubUsername/$RepoName" -Headers $headers -Method Get -ErrorAction SilentlyContinue
    $repoExists = $true
    Write-Host "⚠️  Репозиторий $RepoName уже существует!" -ForegroundColor Yellow
    $continue = Read-Host "Продолжить настройку существующего репозитория? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
} catch {
    $repoExists = $false
}

# Создание репозитория (если не существует)
if (-not $repoExists) {
    Write-Host "🔨 Создание репозитория на GitHub..." -ForegroundColor Cyan
    $body = @{
        name = $RepoName
        description = "VISION_OS v0.9.1 - Neural Interface Terminal for real-time hand gesture recognition"
        private = $false
        has_issues = $true
        has_projects = $true
        has_wiki = $false
        has_downloads = $true
        auto_init = $false
    } | ConvertTo-Json
    
    try {
        $createResponse = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $body -ContentType "application/json"
        Write-Host "✅ Репозиторий создан успешно!" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 422) {
            Write-Host "⚠️  Репозиторий уже существует (возможно, приватный)" -ForegroundColor Yellow
            $repoExists = $true
        } else {
            Write-Host "❌ Ошибка при создании репозитория: $_" -ForegroundColor Red
            exit 1
        }
    }
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
    Write-Host "ℹ️  Коммит не создан (возможно, нет изменений или уже есть коммиты)" -ForegroundColor Yellow
}

# Переименование ветки в main
Write-Host "🌿 Настройка ветки main..." -ForegroundColor Cyan
try {
    git branch -M main
    Write-Host "✅ Ветка настроена" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Ветка уже называется main" -ForegroundColor Yellow
}

# Добавление remote
Write-Host "🔗 Настройка remote..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin "https://$GitHubToken@github.com/$GitHubUsername/$RepoName.git"
Write-Host "✅ Remote настроен" -ForegroundColor Green

# Обновление README с username
Write-Host "📝 Обновление README с вашим username..." -ForegroundColor Cyan
if (Test-Path "README.md") {
    $content = Get-Content "README.md" -Raw
    $content = $content -replace "yourusername", $GitHubUsername
    Set-Content "README.md" -Value $content -NoNewline
    Write-Host "✅ README обновлен" -ForegroundColor Green
    
    # Добавляем обновленный README в коммит
    git add README.md
    git commit -m "docs: update README with GitHub username" 2>$null
}

# Отправка кода на GitHub
Write-Host "📤 Отправка кода на GitHub..." -ForegroundColor Cyan
try {
    git push -u origin main
    Write-Host "✅ Код отправлен успешно!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ошибка при отправке. Попробуйте вручную:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Gray
}

# Удаление токена из remote URL (безопасность)
Write-Host "🔒 Удаление токена из remote URL (безопасность)..." -ForegroundColor Cyan
git remote set-url origin "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "✅ Безопасность настроена" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Всё готово!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Репозиторий: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Проверьте репозиторий на GitHub" -ForegroundColor White
Write-Host "   2. Проверьте GitHub Actions в вкладке 'Actions'" -ForegroundColor White
Write-Host "   3. Создайте первый Release (v0.9.1)" -ForegroundColor White
Write-Host "   4. Добавьте Topics: react, typescript, mediapipe, gesture-recognition" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Удачи с проектом!" -ForegroundColor Green

