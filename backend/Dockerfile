FROM node:20-slim

LABEL application="venu-tech-backend"
LABEL description="Venu Tech NestJS API Backend"

# Install OpenSSL required by Prisma engine
RUN apt-get update -y && apt-get install -y openssl bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

# Ensure line endings are LF and generate Prisma client
RUN sed -i 's/\r$//' ./scripts/docker-entrypoint.sh && chmod +x ./scripts/docker-entrypoint.sh
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
