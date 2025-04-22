FROM python:3.11-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Создание рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY requirements.txt .

# Установка зависимостей Python
RUN pip install --no-cache-dir -r requirements.txt

# Копирование проекта
COPY . .

# Создание пользователя без прав root
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Сборка статических файлов
RUN python manage.py collectstatic --noinput

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "protein_bar.wsgi:application"] 