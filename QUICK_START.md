# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan aplikasi Holy Bible dalam 5 menit.

---

## 🚀 Langkah Cepat

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Setup Environment

**Buat file `.env` di root folder:**

```env
DATABASE_URL=postgresql://hb_user:hb_pass@localhost:5432/holybible
PORT=4000
JWT_PRIVATE_KEY=dev_secret_change_me
NODE_ENV=development
```

**Buat file `.env` di folder `frontend/`:**

```env
VITE_API_URL=http://localhost:4000
```

### 3. Start Database (dengan Docker)

```bash
docker compose up -d postgres
```

**Atau tanpa Docker:** Install PostgreSQL manual dan buat database `holybible`

### 4. Setup Database Schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Backend: http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:5173

---

## 🎯 Akses Aplikasi

| Service | URL | Deskripsi |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Aplikasi web utama |
| **Backend API** | http://localhost:4000 | REST API |
| **API Docs** | http://localhost:4000/docs | Swagger UI |

---

## 📝 Catatan

- **Redis & Meilisearch** bersifat opsional untuk development
- Backend akan tetap berjalan tanpa Redis (fitur job queue tidak aktif)
- Frontend menggunakan Bible API eksternal secara default

---

## ❓ Troubleshooting Cepat

**Backend error Redis?**
→ Abaikan saja, backend tetap berjalan

**Port sudah digunakan?**
→ Ubah `PORT` di `.env` (backend) atau di `vite.config.js` (frontend)

**Database connection error?**
→ Pastikan PostgreSQL berjalan dan credentials benar

**Module not found?**
→ Jalankan `npm install` lagi

---

## 📚 Dokumentasi Lengkap

Lihat [PANDUAN_MENJALANKAN.md](./PANDUAN_MENJALANKAN.md) untuk dokumentasi detail.

---

**Happy Coding! 🙏**
