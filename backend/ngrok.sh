#!/bin/bash

# Читаем порт из .env файла
API_HTTP_PORT=$(grep API_HTTP_PORT .env | cut -d '=' -f2)

# Если порт не найден, используем значение по умолчанию
if [ -z "$API_HTTP_PORT" ]; then
    API_HTTP_PORT=8001
fi

# Читаем токен из .env файла
NGROK_AUTH_TOKEN=$(grep NGROK_AUTH_TOKEN .env | cut -d '=' -f2)

# Создаем временный конфигурационный файл с подставленными значениями
cat ngrok.yml | sed "s/\${API_HTTP_PORT}/$API_HTTP_PORT/g" | sed "s/\${NGROK_AUTH_TOKEN}/$NGROK_AUTH_TOKEN/g" > ngrok.temp.yml

# Запускаем ngrok с конфигурационным файлом
ngrok start --config ngrok.temp.yml api

# Удаляем временный файл
rm ngrok.temp.yml
