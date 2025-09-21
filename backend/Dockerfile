# ./backend/Dockerfile
FROM node:20.18.0

WORKDIR /app

COPY package*.json ./


RUN echo "🚀 ~ Instalando as dependências do backend"

RUN apt-get update && apt-get install -y netcat-openbsd

RUN yarn install --frozen-lockfile --check-files

RUN yarn add -D esbuild@latest --force

COPY . .

RUN chmod +x start.sh

CMD ["./start.sh"]


EXPOSE 4000
