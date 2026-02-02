FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=development

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    procps \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm @nestjs/cli

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 4000 9229