#!/bin/bash
set -e

echo "Starting Venu Tech Backend Docker Container..."

if [ -n "$DATABASE_URL" ]; then
  echo "Syncing Prisma schema to database..."
  npx prisma generate --schema=src/prisma/schema.prisma
  npx prisma db push --schema=src/prisma/schema.prisma
  echo "Seeding runtime data..."
  node scripts/prisma-seed-runtime.js || true
fi

echo "Launching NestJS application on port ${PORT:-3000}..."
exec node dist/main.js
