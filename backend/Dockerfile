FROM node:20-alpine

LABEL application="venu-tech-backend"
LABEL description="Venu Tech NestJS API Backend"

# Install openssl for Prisma runtime on Alpine
RUN apk add --no-cache openssl bash libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY dist ./dist
COPY src/prisma ./src/prisma
COPY scripts ./scripts

RUN sed -i 's/\r$//' ./scripts/docker-entrypoint.sh && chmod +x ./scripts/docker-entrypoint.sh
RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 3000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
