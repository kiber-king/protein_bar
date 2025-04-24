#!/bin/bash

# Ожидание готовности базы данных
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Применение миграций
python manage.py migrate

# Сбор статических файлов
python manage.py collectstatic --noinput

# Запуск сервера
exec python manage.py runserver 0.0.0.0:8000 