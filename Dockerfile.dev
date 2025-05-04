# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем глобально nodemon
RUN npm install -g nodemon

# Создаем директорию приложения
WORKDIR /usr/src/app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем конфигурацию nodemon
COPY nodemon.json ./

# Открываем порт
EXPOSE ${API_HTTP_PORT}

# Запускаем приложение с nodemon
CMD ["nodemon"] 