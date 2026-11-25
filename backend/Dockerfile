FROM node:20-alpine

LABEL application="venu-tech-backend"
LABEL description="Venu Tech NestJS API Backend"

RUN apk add --no-cache openssl bash libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

RUN sed -i 's/\r$//' ./scripts/docker-entrypoint.sh && chmod +x ./scripts/docker-entrypoint.sh
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
