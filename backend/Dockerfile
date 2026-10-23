# backend/Dockerfile
FROM node:20.18.0

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . .

# Gera o Prisma Client, compila o TypeScript e copia o client para dist/
RUN yarn build

RUN chmod +x start.sh

EXPOSE 4000

CMD ["./start.sh"]
