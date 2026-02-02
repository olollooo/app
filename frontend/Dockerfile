FROM node:20-bookworm-slim

WORKDIR /app

RUN npm install -g pnpm

RUN pnpm create next-app@latest . \
    --typescript \
    --tailwind \
    --eslint \
    --src-dir \
    --app \
    --yes

COPY . .

EXPOSE 3000