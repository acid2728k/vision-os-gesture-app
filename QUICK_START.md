# ⚡ Быстрый старт - Создание GitHub репозитория

## 🎯 Вариант 1: С API токеном (САМЫЙ ПРОСТОЙ! 🚀)

Если у вас есть GitHub Personal Access Token - это самый быстрый способ!

### 📖 Сначала получите токен:
Смотрите подробную инструкцию в файле **[HOW_TO_GET_GITHUB_TOKEN.md](HOW_TO_GET_GITHUB_TOKEN.md)**

**Кратко:**
1. Перейдите на https://github.com/settings/tokens
2. Generate new token (classic)
3. Выберите scope: **`repo`** (полный доступ)
4. Скопируйте токен (показывается только один раз!)

### 🚀 Затем запустите скрипт:

**Для Mac/Linux:**
```bash
cd vision-os-gesture-app
chmod +x create-repo-with-api.sh
./create-repo-with-api.sh YOUR_TOKEN YOUR_USERNAME
```

**Для Windows (PowerShell):**
```powershell
cd vision-os-gesture-app
.\create-repo-with-api.ps1 -GitHubToken "YOUR_TOKEN" -GitHubUsername "YOUR_USERNAME"
```

**Что делает скрипт:**
- ✅ Проверяет токен
- ✅ Создает репозиторий на GitHub через API
- ✅ Инициализирует git
- ✅ Создает первый коммит
- ✅ Отправляет код на GitHub
- ✅ Обновляет README с вашим username
- ✅ Настраивает безопасность

**Всё автоматически! 🎉**

---

## 🎯 Вариант 2: Автоматический (с GitHub CLI)

### Для Mac/Linux:
```bash
cd vision-os-gesture-app
chmod +x setup-github.sh
./setup-github.sh YOUR_GITHUB_USERNAME
```

### Для Windows (PowerShell):
```powershell
cd vision-os-gesture-app
.\setup-github.ps1 -GitHubUsername "YOUR_GITHUB_USERNAME"
```

**Что делает скрипт:**
- ✅ Инициализирует git репозиторий
- ✅ Добавляет все файлы
- ✅ Создает первый коммит
- ✅ Настраивает ветку main
- ✅ Если установлен GitHub CLI - создает репозиторий автоматически
- ✅ Обновляет README с вашим username

---

---

## 🎯 Вариант 3: Ручной (если нет GitHub CLI и токена)

### Шаг 1: Создайте репозиторий на GitHub
1. Перейдите на https://github.com/new
2. Repository name: `vision-os-gesture-app`
3. **НЕ** ставьте галочки на:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
4. Нажмите **Create repository**

### Шаг 2: Выполните команды в терминале

```bash
# Перейдите в директорию проекта
cd vision-os-gesture-app

# Инициализируйте git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "feat: initial commit - VISION_OS v0.9.1 Neural Interface Terminal

- Add React + TypeScript + Vite setup
- Integrate MediaPipe Hands for gesture recognition
- Create all UI components
- Setup GitHub Actions workflows
- Add documentation"

# Переименуйте ветку в main
git branch -M main

# Добавьте remote (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vision-os-gesture-app.git

# Отправьте код на GitHub
git push -u origin main
```

---

---

## 🎯 Вариант 4: С GitHub CLI (альтернатива)

Если у вас установлен GitHub CLI:

```bash
# Авторизуйтесь (если еще не сделано)
gh auth login

# Перейдите в директорию проекта
cd vision-os-gesture-app

# Инициализируйте git и создайте коммит
git init
git add .
git commit -m "feat: initial commit - VISION_OS v0.9.1"

# Создайте репозиторий и отправьте код одной командой
gh repo create vision-os-gesture-app \
  --public \
  --description "VISION_OS v0.9.1 - Neural Interface Terminal" \
  --source=. \
  --remote=origin \
  --push
```

---

## ✅ После создания репозитория

1. **Проверьте GitHub Actions**
   - Откройте вкладку "Actions" на GitHub
   - Убедитесь, что workflows запустились

2. **Обновите README**
   - Замените `yourusername` на ваш GitHub username в badges

3. **Создайте первый Release**
   - Перейдите в "Releases" → "Create a new release"
   - Tag: `v0.9.1`
   - Title: `VISION_OS v0.9.1 - Initial Release`

4. **Добавьте Topics**
   - В настройках репозитория добавьте теги:
     - `react`
     - `typescript`
     - `mediapipe`
     - `gesture-recognition`
     - `computer-vision`

---

## 🆘 Нужна помощь?

Если что-то не работает:
- Проверьте, что Git установлен: `git --version`
- Проверьте подключение к GitHub
- Убедитесь, что у вас есть права на создание репозиториев
- Для GitHub CLI: `gh auth login`

---

**Готово! 🎉** Ваш репозиторий настроен и готов к работе!

