# Quick Start Guide - 5 Menit

Panduan cepat untuk menjalankan HOLY BIBLE dalam 5 menit!

## Prasyarat

- Node.js 20+ terinstall
- Docker & Docker Compose terinstall
- Git terinstall

## Langkah Cepat

### 1. Clone & Masuk ke Direktori
```bash
git clone [https://github.com/yourusername/HOLY_BIBLE.git](https://github.com/yourusername/HOLY_BIBLE.git)
cd HOLY_BIBLE
```

### 2. Setup Environment
```bash
# Copy template environment
cp env.template .env
cp frontend/env.template frontend/.env
```

### 3. Start Services dengan Docker
```bash
docker compose up -d
```

Tunggu beberapa detik hingga semua services siap:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Meilisearch (port 7700)
- MinIO (port 9000)

### 4. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 5. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run seed:sample
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

## Selesai!

Buka browser dan akses:
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:4000/docs
- **Meilisearch**: http://localhost:7700
- **MinIO**: http://localhost:9000

## Fitur yang Bisa Dicoba

1. **Baca Alkitab** - Navigasi ke halaman Read
2. **Cari Ayat** - Gunakan fitur Search
3. **Register/Login** - Buat akun untuk akses fitur lengkap
4. **Bookmarks** - Simpan ayat favorit (perlu login)

## Troubleshooting Cepat

### Port sudah digunakan?
```bash
# Cek port yang digunakan
netstat -ano | findstr :4000  # Windows
lsof -i :4000                 # Mac/Linux
```

### Docker services tidak start?
```bash
# Cek status
docker compose ps

# Restart services
docker compose restart
```

### Database error?
```bash
# Reset database
npm run prisma:migrate reset
npm run prisma:migrate
```

## Next Steps

- Baca [Panduan Lengkap](./PANDUAN_MENJALANKAN.md) untuk detail lebih lanjut
- Cek [Setup Checklist](./SETUP_CHECKLIST.md) untuk memastikan semua benar
- Lihat [Command Reference](./COMMANDS.md) untuk command yang sering digunakan

---
