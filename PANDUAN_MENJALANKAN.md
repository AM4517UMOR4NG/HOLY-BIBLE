# 📖 Panduan Menjalankan Aplikasi Holy Bible

Dokumentasi lengkap untuk menjalankan backend dan frontend aplikasi Holy Bible.

---

## 📋 Daftar Isi

1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Struktur Proyek](#struktur-proyek)
3. [Instalasi](#instalasi)
4. [Menjalankan Backend](#menjalankan-backend)
5. [Menjalankan Frontend](#menjalankan-frontend)
6. [Menjalankan Keduanya Sekaligus](#menjalankan-keduanya-sekaligus)
7. [Troubleshooting](#troubleshooting)

---

## 🖥️ Persyaratan Sistem

### Wajib
- **Node.js** versi 20 atau lebih tinggi
- **npm** (biasanya sudah terinstall dengan Node.js)
- **PostgreSQL** (untuk database)

### Opsional (untuk fitur lengkap)
- **Redis** (untuk job queue/background workers)
- **Meilisearch** (untuk pencarian full-text)
- **MinIO** (untuk penyimpanan file)
- **Docker & Docker Compose** (untuk menjalankan semua service sekaligus)

---

## 📁 Struktur Proyek

```
HOLY_BIBLE/
├── src/                    # Backend source code
│   ├── routes/            # API endpoints
│   ├── lib/               # Utilities & database
│   ├── jobs/              # Background jobs
│   └── index.ts           # Entry point backend
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # API integration
│   │   └── App.tsx       # Main app
│   └── package.json
├── prisma/                # Database schema
├── package.json           # Backend dependencies
└── docker-compose.yml     # Docker services
```

---

## 📦 Instalasi

### 1. Clone Repository (jika belum)

```bash
git clone <repository-url>
cd HOLY_BIBLE
```

### 2. Install Dependencies Backend

```bash
# Di root folder
npm install
```

### 3. Install Dependencies Frontend

```bash
# Masuk ke folder frontend
cd frontend
npm install
cd ..
```

### 4. Setup Environment Variables

#### Backend (.env di root folder)

Buat file `.env` di root folder dengan isi:

```env
# Database
DATABASE_URL=postgresql://hb_user:hb_pass@localhost:5432/holybible

# Redis (opsional - untuk background jobs)
REDIS_URL=redis://localhost:6379

# Meilisearch (opsional - untuk search)
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=masterKey

# MinIO/S3 (opsional - untuk file upload)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123

# JWT Authentication
JWT_PRIVATE_KEY=dev_secret_change_me_in_production
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES=30d

# Server
PORT=4000
NODE_ENV=development
```

#### Frontend (.env di folder frontend)

Buat file `.env` di folder `frontend/`:

```env
VITE_API_URL=http://localhost:4000
```

### 5. Setup Database

#### Opsi A: Menggunakan Docker (Recommended)

```bash
# Jalankan semua services (PostgreSQL, Redis, Meilisearch, MinIO)
docker compose up -d

# Cek status services
docker compose ps
```

Services yang akan berjalan:
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Meilisearch**: `http://localhost:7700`
- **MinIO**: `http://localhost:9000`

#### Opsi B: Install PostgreSQL Manual

Jika tidak menggunakan Docker, install PostgreSQL secara manual dan buat database:

```sql
CREATE DATABASE holybible;
CREATE USER hb_user WITH PASSWORD 'hb_pass';
GRANT ALL PRIVILEGES ON DATABASE holybible TO hb_user;
```

### 6. Jalankan Migrasi Database

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev --name init

# (Opsional) Seed data sample
npm run seed:sample
```

---

## 🚀 Menjalankan Backend

### Mode Development (dengan auto-reload)

```bash
# Di root folder
npm run dev
```

Backend akan berjalan di: **http://localhost:4000**

### Akses API Documentation

Buka browser dan kunjungi:
- **Swagger UI**: http://localhost:4000/docs

### Endpoints Utama

- `GET /health` - Health check
- `POST /v1/auth/register` - Registrasi user
- `POST /v1/auth/login` - Login
- `GET /v1/bible/versions` - List versi Alkitab
- `GET /v1/bible/books` - List buku Alkitab
- `GET /v1/bible/verses` - Ambil ayat
- `POST /v1/search` - Pencarian ayat
- `GET /v1/bookmarks` - Bookmark user
- `GET /v1/annotations` - Catatan user

### Mode Production

```bash
# Build
npm run build

# Start
npm start
```

---

## 🎨 Menjalankan Frontend

### Mode Development

```bash
# Masuk ke folder frontend
cd frontend

# Jalankan dev server
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### Fitur Frontend

- 📖 **Pembaca Alkitab** - Baca Alkitab dengan tampilan bersih
- 🔍 **Pencarian** - Cari ayat dengan mudah
- 🔖 **Bookmark** - Simpan ayat favorit
- 📝 **Catatan** - Tambahkan catatan pribadi
- 🌓 **Dark Mode** - Mode gelap untuk kenyamanan mata
- 📱 **Responsive** - Tampilan optimal di semua perangkat

### Build untuk Production

```bash
cd frontend
npm run build

# Preview build
npm run preview
```

File hasil build akan ada di folder `frontend/dist/`

---

## ⚡ Menjalankan Keduanya Sekaligus

### Opsi 1: Menggunakan 2 Terminal

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Opsi 2: Menggunakan Script (Recommended)

Buat file `start-all.bat` (Windows) atau `start-all.sh` (Linux/Mac):

**Windows (start-all.bat):**
```batch
@echo off
echo Starting Backend...
start cmd /k "npm run dev"

timeout /t 3

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:4000/docs
echo ========================================
```

**Linux/Mac (start-all.sh):**
```bash
#!/bin/bash

echo "Starting Backend..."
npm run dev &

sleep 3

echo "Starting Frontend..."
cd frontend && npm run dev &

echo ""
echo "========================================"
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:4000/docs"
echo "========================================"
```

Jalankan:
```bash
# Windows
start-all.bat

# Linux/Mac
chmod +x start-all.sh
./start-all.sh
```

---

## 🔧 Troubleshooting

### Backend tidak bisa connect ke Redis

**Masalah:** Error `ECONNREFUSED 127.0.0.1:6379`

**Solusi:** 
- Redis bersifat opsional untuk development
- Backend sudah dikonfigurasi untuk berjalan tanpa Redis
- Fitur background jobs tidak akan tersedia tanpa Redis
- Untuk mengaktifkan Redis: `docker compose up -d redis`

### Backend tidak bisa connect ke Database

**Masalah:** Error `Can't reach database server`

**Solusi:**
1. Pastikan PostgreSQL berjalan:
   ```bash
   # Jika pakai Docker
   docker compose up -d postgres
   
   # Cek status
   docker compose ps
   ```

2. Cek connection string di `.env`:
   ```env
   DATABASE_URL=postgresql://hb_user:hb_pass@localhost:5432/holybible
   ```

3. Test koneksi database:
   ```bash
   npx prisma db pull
   ```

### Port sudah digunakan

**Masalah:** `Port 4000 already in use` atau `Port 5173 already in use`

**Solusi:**
1. Hentikan proses yang menggunakan port tersebut
2. Atau ubah port di konfigurasi:
   - Backend: Ubah `PORT` di `.env`
   - Frontend: Ubah di `vite.config.js`

### Frontend tidak bisa connect ke Backend

**Masalah:** API calls gagal dengan CORS error

**Solusi:**
1. Pastikan backend berjalan di `http://localhost:4000`
2. Cek file `.env` di folder frontend:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
3. Restart frontend setelah mengubah `.env`

### Prisma migration error

**Masalah:** Error saat menjalankan `prisma migrate`

**Solusi:**
```bash
# Reset database (HATI-HATI: akan menghapus semua data)
npx prisma migrate reset

# Atau generate ulang
npx prisma generate
npx prisma migrate dev --name init
```

### Module not found errors

**Masalah:** Error `Cannot find module`

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install

# Untuk frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Catatan Penting

### Development vs Production

**Development:**
- Hot reload aktif
- Logging verbose
- CORS terbuka untuk localhost
- Tidak perlu build

**Production:**
- Harus build terlebih dahulu
- Gunakan environment variables yang aman
- Setup reverse proxy (nginx/apache)
- Enable HTTPS
- Batasi CORS ke domain spesifik

### Keamanan

⚠️ **PENTING untuk Production:**

1. Ganti `JWT_PRIVATE_KEY` dengan key yang kuat
2. Gunakan password database yang kuat
3. Jangan commit file `.env` ke git
4. Enable HTTPS
5. Setup firewall
6. Regular backup database

### Performance Tips

- Gunakan Redis untuk caching dan job queue
- Enable Meilisearch untuk pencarian cepat
- Setup CDN untuk static assets
- Enable gzip compression
- Use connection pooling untuk database

---

## 🆘 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. Cek log error di terminal
2. Cek file log aplikasi
3. Buka issue di repository
4. Hubungi tim development

---

## 📚 Dokumentasi Tambahan

- [Backend API Documentation](./README.md)
- [Frontend Documentation](./frontend/README.md)
- [Database Schema](./prisma/schema.prisma)
- [OpenAPI Specification](./openapi.yaml)

---

**Selamat menggunakan Holy Bible App! 🙏**
