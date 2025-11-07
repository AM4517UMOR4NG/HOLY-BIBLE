# HOLY BIBLE Backend (MVP scaffolding)

This repo contains initial deliverables to bootstrap the backend: Prisma schema, OpenAPI spec, and local Docker services (PostgreSQL, Redis, Meilisearch, MinIO).

## 📚 Dokumentasi

> **📖 [Index Dokumentasi Lengkap](./DOKUMENTASI_INDEX.md)** - Panduan navigasi semua dokumentasi

### 🇮🇩 Bahasa Indonesia
- **[⚡ Quick Start Guide](./QUICK_START.md)** - Panduan cepat 5 menit (mulai dari sini!)
- **[📖 Panduan Lengkap](./PANDUAN_MENJALANKAN.md)** - Dokumentasi lengkap dengan troubleshooting
- **[✅ Setup Checklist](./SETUP_CHECKLIST.md)** - Checklist untuk memastikan setup benar
- **[🛠️ Command Reference](./COMMANDS.md)** - Daftar lengkap command yang sering digunakan

### 🔐 Authentication (NEW!)
- **[🚀 Quick Reference](./AUTH_QUICK_REFERENCE.md)** - Quick API reference untuk auth
- **[📖 API Testing Guide](./AUTH_API_TESTING.md)** - Comprehensive testing documentation
- **[✨ Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)** - Fitur & implementation details

### 🇬🇧 English
- **[Frontend Documentation](./frontend/README.md)** - Frontend specific docs
- **[API Documentation](http://localhost:4000/docs)** - Swagger UI (when server is running)

### 🔧 Templates & Scripts
- **[Backend .env Template](./env.template)** - Environment variables template
- **[Frontend .env Template](./frontend/env.template)** - Frontend environment template
- **[Start All Script](./start-all.bat)** - Windows script untuk start semua services
- **[Start All Script](./start-all.sh)** - Linux/Mac script untuk start semua services

## Quick start (local)

1. Create an `.env` file using the values below (adjust as needed):

```env
DATABASE_URL=postgresql://hb_user:hb_pass@postgres:5432/holybible
REDIS_URL=redis://redis:6379
MEILI_HOST=http://meilisearch:7700
MEILI_API_KEY=masterKey
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
JWT_PRIVATE_KEY=dev_secret_change_me
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES=30d
PORT=4000
NODE_ENV=development
```

2. Start infra services:

```bash
docker compose up -d
```

Services:
- Postgres: localhost:5432 (db=holybible, user=hb_user, pass=hb_pass)
- Redis: localhost:6379
- Meilisearch: http://localhost:7700 (key: masterKey)
- MinIO: http://localhost:9000 (user=minio, pass=minio123)

3. Install deps & run backend in dev:

```bash
npm i
npm run dev
```

4. Prisma (optional until you run migrations):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. API contract
- OpenAPI: `openapi.yaml`
- Swagger UI (runtime): `http://localhost:4000/docs`

## Background workers
- Workers auto-start with the server (BullMQ + Redis).
- Enqueue import job (admin only): `POST /v1/admin/import` with optional `versionCode`.
- Check job status: `GET /v1/admin/jobs/{jobId}`.

## JSON import format (temporary MVP)

POST `/v1/admin/import` with JSON body:

```json
{
  "versionCode": "KJV",
  "title": "King James Version",
  "language": "en",
  "books": [
    {
      "name": "John",
      "order": 43,
      "chapters": [
        {
          "number": 3,
          "verses": [
            { "number": 16, "text": "For God so loved the world..." }
          ]
        }
      ]
    }
  ]
}
```

Example:

```bash
curl -X POST http://localhost:4000/v1/admin/import \
 -H "Authorization: Bearer <ADMIN_TOKEN>" \
 -H "Content-Type: application/json" \
 -d @payload.json
```

This will insert the data and enqueue indexing to Meilisearch.

## Seeding (sample)

```bash
npm run seed:sample
```

Seeds a minimal KJV sample and enqueues indexing.

## Notes
- Keep env secrets out of VCS for non-dev environments.
- Ensure Meilisearch index settings (searchable/filterable) are applied during bootstrap.
