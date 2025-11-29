# 📤 Размещение Проекта на GitHub

## 📋 Требования

1. Аккаунт GitHub (https://github.com)
2. Git установлен на компьютере (https://git-scm.com)
3. Node.js установлен

## ✅ Шаг 1: Установить Git

Если еще не установлен:
1. Скачайте с https://git-scm.com
2. Установите с default настройками
3. Перезагрузитесь

Проверьте:
```bash
git --version
```

## ✅ Шаг 2: Настроить Git

Установите ваши данные:
```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

## ✅ Шаг 3: Создать Репозиторий на GitHub

1. Откройте https://github.com/new
2. Назовите репозиторий: `photo-hosting` или `imagehost`
3. Выберите:
   - Description: "Web Photo Hosting Platform (Imgur-style) with Node.js + React"
   - Public (чтобы все могли видеть)
   - Не добавляйте README.md, .gitignore, license (мы уже их имеем)
4. Нажмите "Create repository"

Скопируйте URL репозитория вида: `https://github.com/YOUR_USERNAME/photo-hosting.git`

## ✅ Шаг 4: Инициализировать Git в Проекте

Откройте PowerShell в папке `d:\project\three`:

```bash
cd d:\project\three

# Инициализировать git
git init

# Добавить все файлы
git add .

# Создать первый коммит
git commit -m "Initial commit: Full photo hosting platform scaffold"

# Добавить remote (замените URL!)
git remote add origin https://github.com/YOUR_USERNAME/photo-hosting.git

# Загрузить на GitHub
git branch -M main
git push -u origin main
```

## 📝 Полный Скрипт для PowerShell

Если хотите все сделать автоматически, сохраните это в файл `push-to-github.ps1`:

```powershell
$repoUrl = Read-Host "Введите URL репозитория GitHub (https://github.com/YOUR_USERNAME/photo-hosting.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ URL не введен" -ForegroundColor Red
    exit
}

Write-Host "🚀 Инициализация Git репозитория..." -ForegroundColor Cyan
cd d:\project\three

# Инициализировать
git init
git config user.name "Developer"
git config user.email "dev@example.com"

# Добавить все файлы
Write-Host "📁 Добавление файлов..." -ForegroundColor Yellow
git add .

# Создать коммит
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
git commit -m "Initial commit: Photo hosting platform with Node.js + React + Docker"

# Добавить remote
Write-Host "🔗 Подключение к GitHub..." -ForegroundColor Yellow
git remote add origin $repoUrl

# Push
Write-Host "📤 Загрузка на GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green
Write-Host "📍 Ваш репозиторий: $repoUrl" -ForegroundColor Green
```

## 🔐 Если Запрашивается Пароль

GitHub требует **Personal Access Token** вместо пароля:

1. Откройте https://github.com/settings/tokens/new
2. Выберите scopes:
   - ✅ `repo` (все)
   - ✅ `workflow`
3. Сгенерируйте токен
4. Скопируйте токен
5. При запросе пароля введите токен

## ✅ Проверка

После push откройте https://github.com/YOUR_USERNAME/photo-hosting

Должны видеть:
- Все папки (backend, frontend, docs)
- Все файлы (.gitignore, README.md, package.json и т.д.)
- История коммитов

## 📊 Что Будет на GitHub

```
photo-hosting/
├── backend/              (Express.js приложение)
├── frontend/             (React приложение)
├── docs/                 (Документация)
├── docker-compose.yml
├── .gitignore
├── README.md
├── QUICK_START.md
├── SETUP_GUIDE.md
├── ARCHITECTURE.md
└── API_DOCUMENTATION.md
```

## 🚀 Следующие Шаги

### Добавить GitHub Actions (CI/CD)

Создайте файл `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install & Test Backend
        run: cd backend && npm install && npm run test:watch
      
      - name: Install Frontend
        run: cd frontend && npm install
```

### Развертывание на Heroku/Railway/Render

После push, можно развернуть бесплатно на:
- **Heroku** (https://www.heroku.com) - Backend
- **Vercel** (https://vercel.com) - Frontend
- **Railway** (https://railway.app) - Все вместе

## 📞 Справка по Git Командам

```bash
# Проверить статус
git status

# Просмотреть коммиты
git log --oneline

# Создать новую ветку
git checkout -b feature/new-feature

# Отправить ветку
git push -u origin feature/new-feature

# Создать Pull Request на GitHub

# Обновить локальный репозиторий
git pull origin main
```

## ⚠️ Важно

- **Не загружайте .env файлы** - используйте .env.example (уже в .gitignore)
- **Не загружайте node_modules** - dependencies устанавливаются через npm install
- **Проверьте .gitignore** - он уже правильный

## 🎯 Готово!

Теперь ваш проект на GitHub и готов к совместной разработке! 🎉
