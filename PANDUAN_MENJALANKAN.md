# 📖 Panduan Lengkap - HOLY BIBLE

Panduan komprehensif untuk setup, konfigurasi, dan troubleshooting aplikasi HOLY BIBLE.

## 📋 Daftar Isi

1. [Prasyarat](#-prasyarat)
2. [Installation](#-installation)
3. [Konfigurasi](#-konfigurasi)
4. [Menjalankan Aplikasi](#-menjalankan-aplikasi)
5. [Troubleshooting](#-troubleshooting)
6. [Best Practices](#-best-practices)

---

## 🔧 Prasyarat

### Software yang Diperlukan

| Software | Version | Keterangan |
|----------|---------|------------|
| Node.js | 20+ | Runtime JavaScript |
| npm/yarn | Latest | Package manager |
| Docker | 20+ | Container platform |
| Docker Compose | 2+ | Multi-container orchestration |
| Git | Latest | Version control |

### Verifikasi Installasi

```bash
# Cek versi
node --version    # Harus 20.x atau lebih tinggi
npm --version
docker --version
docker compose version
git --version
```

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/HOLY_BIBLE.git
cd HOLY_BIBLE
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Setup Environment Variables

**Backend `.env`:**
```env
DATABASE_URL=postgresql://hb_user:hb_pass@localhost:5432/holybible
REDIS_URL=redis://localhost:6379
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=masterKey
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
JWT_PRIVATE_KEY=dev_secret_change_me
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES=30d
PORT=4000
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:4000
```

---

## ⚙️ Konfigurasi

### Database Setup

#### 1. Start PostgreSQL dengan Docker
```bash
docker compose up -d postgres
```

#### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

#### 3. Run Migrations
```bash
npm run prisma:migrate
```

#### 4. (Optional) Seed Sample Data
```bash
npm run seed:sample
```

### Redis Setup
```bash
docker compose up -d redis
```

### Meilisearch Setup
```bash
docker compose up -d meilisearch
```

### MinIO Setup
```bash
docker compose up -d minio
```

---

## 🚀 Menjalankan Aplikasi

### Development Mode

#### Backend
```bash
npm run dev
```
Server akan berjalan di `http://localhost:4000`

#### Frontend
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### Production Mode

#### Build
```bash
# Backend
npm run build

# Frontend
cd frontend
npm run build
```

#### Start
```bash
# Backend
npm start

# Frontend (preview)
cd frontend
npm run preview
```

### Menggunakan Script Otomatis

**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## 🔍 Troubleshooting

### Masalah Umum

#### 1. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solusi:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

#### 2. Database Connection Error

**Error:**
```
Can't reach database server
```

**Solusi:**
```bash
# Cek apakah PostgreSQL running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Cek connection string di .env
# Pastikan DATABASE_URL benar
```

#### 3. Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solusi:**
```bash
npm run prisma:generate
```

#### 4. Migration Error

**Error:**
```
Migration failed
```

**Solusi:**
```bash
# Reset database (HATI-HATI: akan menghapus semua data!)
npm run prisma:migrate reset

# Atau rollback migration terakhir
npx prisma migrate resolve --rolled-back <migration_name>
```

#### 5. Meilisearch Connection Error

**Error:**
```
Meilisearch connection failed
```

**Solusi:**
```bash
# Cek Meilisearch status
docker compose ps meilisearch

# Restart Meilisearch
docker compose restart meilisearch

# Cek MEILI_HOST dan MEILI_API_KEY di .env
```

#### 6. Redis Connection Error

**Error:**
```
Redis connection failed
```

**Solusi:**
```bash
# Cek Redis status
docker compose ps redis

# Restart Redis
docker compose restart redis

# Catatan: Redis bersifat opsional untuk development
```

#### 7. Frontend API Connection Error

**Error:**
```
Failed to fetch from API
```

**Solusi:**
1. Pastikan backend sudah running di `http://localhost:4000`
2. Cek `VITE_API_URL` di `frontend/.env`
3. Cek CORS settings di backend
4. Buka browser console untuk detail error

#### 8. Module Not Found Error

**Error:**
```
Cannot find module 'xxx'
```

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

**Backend dengan logging detail:**
```bash
LOG_LEVEL=debug npm run dev
```

**Frontend dengan verbose:**
```bash
cd frontend
npm run dev -- --debug
```

---

## 💡 Best Practices

### 1. Environment Variables
- ✅ Jangan commit `.env` ke git
- ✅ Gunakan `.env.example` sebagai template
- ✅ Gunakan secret management untuk production

### 2. Database
- ✅ Backup database secara berkala
- ✅ Gunakan migrations untuk schema changes
- ✅ Jangan edit migration yang sudah di-deploy

### 3. Security
- ✅ Ganti `JWT_PRIVATE_KEY` dengan random string untuk production
- ✅ Gunakan HTTPS untuk production
- ✅ Set CORS dengan benar
- ✅ Validasi semua input

### 4. Development
- ✅ Gunakan TypeScript strict mode
- ✅ Run linter sebelum commit
- ✅ Write tests untuk fitur baru
- ✅ Update dokumentasi saat menambah fitur

### 5. Performance
- ✅ Gunakan database indexing
- ✅ Optimize queries
- ✅ Cache hasil query yang sering digunakan
- ✅ Monitor resource usage

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com)

---

## 🆘 Butuh Bantuan?

- 📖 Baca [Quick Start Guide](./QUICK_START.md) untuk setup cepat
- ✅ Cek [Setup Checklist](./SETUP_CHECKLIST.md)
- 🐛 Buka issue di GitHub
- 💬 Diskusi di GitHub Discussions

---

**Selamat coding! 🎉**

