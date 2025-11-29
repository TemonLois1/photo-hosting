# 🚀 Инструкция по развертыванию БД локально и на Render

## Локальное развертывание

### Шаг 1: Установка PostgreSQL

**Windows:**
1. Скачать с https://www.postgresql.org/download/windows/
2. Запустить installer
3. **Важно:** Запомнить пароль для пользователя `postgres`
4. Выбрать port 5432 (по умолчанию)
5. Завершить установку

**Проверка установки:**
```powershell
psql --version
# Output: psql (PostgreSQL) 13.x (or higher)
```

### Шаг 2: Создание БД

```powershell
# Запустить PostgreSQL командную строку
psql -U postgres

# Создать БД
CREATE DATABASE imagehost_db;
\q
```

### Шаг 3: Настройка Backend

```powershell
cd d:\project\three\backend

# Скопировать .env.example в .env
copy .env.example .env

# Открыть .env и установить:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=imagehost_db
# DB_USER=postgres
# DB_PASSWORD=<пароль_который_вы_установили>
```

### Шаг 4: Установка зависимостей

```powershell
npm install
```

### Шаг 5: Запуск сервера

```powershell
npm start

# Должны увидеть логи:
# ✅ Database connection established
# ✅ Database models synchronized
# 🚀 Server is running!
# 📍 Listening on port 5000
# 🗄️ Database: Connected & Synchronized
```

**Отлично!** 🎉 БД готова локально.

---

## Развертывание на Render.com

### Шаг 1: Создание PostgreSQL сервиса на Render

1. Перейти на https://render.com
2. Нажать **"New +"** → **"PostgreSQL"**
3. Заполнить форму:
   - **Name:** `photo-hosting-db`
   - **Region:** `Frankfurt (Europe)` (ближайший к вам)
   - **PostgreSQL Version:** 13
   - **Database:** `imagehost_db`
   - **User:** `postgres` (или другое имя)
4. Нажать **"Create Database"**
5. **Подождать 5-10 минут** пока сервис создается

### Шаг 2: Получение строки подключения

1. Открыть созданный PostgreSQL сервис
2. В разделе **"Connections"** скопировать:
   - **External Database URL** (для подключения извне)
   - Выглядит как: `postgresql://user:password@host:5432/imagehost_db`

### Шаг 3: Обновление Backend на Render

1. Перейти на Dashboard Render
2. Найти сервис `photo-hosting` (backend)
3. Нажать на него
4. Перейти в **"Environment"**
5. Добавить/обновить переменные окружения:

```
DB_HOST=<host из URL>
DB_PORT=5432
DB_NAME=imagehost_db
DB_USER=postgres
DB_PASSWORD=<password из URL>
NODE_ENV=production
```

**Пример строки подключения:**
```
postgresql://postgres:abc123def456@oregondb.c42.us-east-1.aws.postgres.render.com:5432/imagehost_db
```

Разбор:
- `postgres` = DB_USER
- `abc123def456` = DB_PASSWORD
- `oregondb.c42.us-east-1.aws.postgres.render.com` = DB_HOST
- `5432` = DB_PORT
- `imagehost_db` = DB_NAME

### Шаг 4: Перезагрузка Backend сервиса

1. На странице сервиса нажать **"Manual Deploy"**
2. Подождать пока сервис перезагрузится
3. Проверить логи - должны появиться:
   ```
   ✅ Database connection established
   ✅ Database models synchronized
   ```

### Шаг 5: Проверка подключения

1. Открыть URL сервиса: `https://photo-hosting.onrender.com/health`
2. Должен вернуться JSON:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-15T10:30:45.123Z",
     "uptime": 125.456
   }
```

**Готово!** 🎉 БД на Render подключена.

---

## Проверка состояния БД

### Локально

```powershell
# Подключиться к БД
psql -U postgres -d imagehost_db

# Просмотреть таблицы
\dt

# Просмотреть записи
SELECT * FROM "Users";

# Выход
\q
```

### На Render (через DBeaver или pgAdmin)

1. Скачать [DBeaver Community](https://dbeaver.io/download/)
2. Создать новое подключение:
   - **Database:** PostgreSQL
   - **Host:** Из External Database URL
   - **Port:** 5432
   - **Database:** imagehost_db
   - **Username:** postgres
   - **Password:** Из URL
   - **SSL:** Включить для безопасности
3. Подключиться и просмотреть данные

---

## Миграция данных (если нужно)

### С локального на Render

```powershell
# 1. Экспортировать данные с локального
pg_dump -U postgres imagehost_db > backup.sql

# 2. Импортировать на Render (из того же файла .sql)
psql -U postgres -h <render_host> -d imagehost_db < backup.sql
```

---

## Troubleshooting

| Ошибка | Решение |
|--------|---------|
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL не запущена на локальной машине |
| `database does not exist` | БД не создана (выполнить `CREATE DATABASE imagehost_db;`) |
| `password authentication failed` | Проверить DB_PASSWORD в .env |
| `server closed the connection unexpectedly` | БД на Render перезагружается, подождать 1-2 минуты |
| Модели не синхронизируются | Проверить логи сервера, убедиться что .env содержит корректные данные |

---

## Примеры API запросов (с БД)

После развертывания БД, API можно тестировать:

```bash
# Проверить здоровье сервера
curl https://photo-hosting.onrender.com/health

# Попытка создать пользователя (когда контроллеры будут готовы)
curl -X POST https://photo-hosting.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

---

## Следующие шаги

1. ✅ Установить PostgreSQL локально
2. ✅ Создать БД
3. ✅ Синхронизировать модели Sequelize
4. ⏳ Создать Controllers для API
5. ⏳ Создать Services для бизнес-логики
6. ⏳ Добавить валидацию и обработку ошибок
7. ⏳ Тестировать API endpoints
8. ⏳ Развернуть на Render с PostgreSQL

---

**Контакт поддержки:**
- Render: support@render.com
- PostgreSQL: https://www.postgresql.org/support/

**Документация:**
- Sequelize: https://sequelize.org/
- PostgreSQL: https://www.postgresql.org/docs/
- Render: https://render.com/docs
