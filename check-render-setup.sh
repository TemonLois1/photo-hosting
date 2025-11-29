#!/usr/bin/env bash

# Скрипт для проверки и настройки Render.com развертывания
# Требует: curl, jq

set -e

echo "🚀 Render.com Setup Checker"
echo "============================"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для проверки переменной
check_env_var() {
    local var_name=$1
    local description=$2
    
    if [ -z "${!var_name}" ]; then
        echo -e "${RED}✗${NC} $description не установлена"
        return 1
    else
        echo -e "${GREEN}✓${NC} $description установлена"
        return 0
    fi
}

# Функция для проверки подключения к API
check_api_endpoint() {
    local url=$1
    local description=$2
    
    if curl -s "$url" > /dev/null; then
        echo -e "${GREEN}✓${NC} $description доступна"
        return 0
    else
        echo -e "${RED}✗${NC} $description недоступна"
        return 1
    fi
}

echo "📋 Проверка переменных окружения:"
echo ""

check_env_var "DB_HOST" "DB_HOST"
check_env_var "DB_PORT" "DB_PORT"
check_env_var "DB_NAME" "DB_NAME"
check_env_var "DB_USER" "DB_USER"
check_env_var "DB_PASSWORD" "DB_PASSWORD"
check_env_var "FRONTEND_URL" "FRONTEND_URL"
check_env_var "API_URL" "API_URL"

echo ""
echo "🌐 Проверка доступности сервисов:"
echo ""

# Проверка API endpoints
if [ -n "$API_URL" ]; then
    check_api_endpoint "$API_URL/health" "Health Check"
    check_api_endpoint "$API_URL/auth/register" "Auth API"
fi

# Проверка Frontend
if [ -n "$FRONTEND_URL" ]; then
    check_api_endpoint "$FRONTEND_URL" "Frontend"
fi

echo ""
echo "============================"
echo "✅ Проверка завершена!"
echo ""
echo "📖 Если есть проблемы, смотри: RENDER_SETUP.md"
