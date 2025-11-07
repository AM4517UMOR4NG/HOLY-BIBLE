# Setup Project HOLY BIBLE Backend (Tanpa Docker)

## Prerequisites
- Node.js v18+ 
- npm

## Langkah Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Project ini sudah dikonfigurasi menggunakan SQLite (tidak perlu install PostgreSQL).

Generate Prisma client dan jalankan migrasi:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:4000**

## Endpoints Tersedia

- **Health Check**: http://localhost:4000/health
- **API Documentation (Swagger)**: http://localhost:4000/docs
- **Auth**:
  - POST `/auth/register` - Register user baru
  - POST `/auth/login` - Login
  - GET `/auth/me` - Get user info (requires auth)
- **Bible**: `/v1/bible/*`
- **Search**: `/v1/search/*`
- **Bookmarks**: `/v1/bookmarks/*` (requires auth)
- **Annotations**: `/v1/annotations/*` (requires auth)
- **Admin**: `/v1/admin/*` (requires admin role)

## Konfigurasi

File `.env` sudah dibuat dengan konfigurasi default:
- Database: SQLite (`dev.db`)
- Port: 4000
- JWT Secret: `dev_secret_change_me` (ganti untuk production!)

## Fitur yang Disabled (Karena Tanpa Docker)

Fitur berikut memerlukan services eksternal dan saat ini disabled:
- ❌ **Redis/BullMQ** - Background job processing
- ❌ **Meilisearch** - Full-text search
- ❌ **MinIO** - File storage

Untuk mengaktifkan fitur ini, install services tersebut atau gunakan Docker Compose.

## Testing API

### Register User
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check Health
```bash
curl http://localhost:4000/health
```

## Troubleshooting

### Port 4000 sudah digunakan
Ubah port di file `.env`:
```env
PORT=5000
```

### Error saat npm install
Pastikan Node.js versi 18 atau lebih baru:
```bash
node --version
```

## Database

Database SQLite disimpan di file `dev.db` di root project.

Untuk melihat isi database, gunakan:
```bash
npx prisma studio
```

## Build untuk Production

```bash
npm run build
npm start
```

## Notes

- Project ini adalah MVP backend untuk aplikasi Holy Bible
- Beberapa fitur seperti background workers dan search memerlukan services tambahan
- Untuk development, SQLite sudah cukup
- Untuk production, disarankan menggunakan PostgreSQL dan services lengkap dengan Docker
