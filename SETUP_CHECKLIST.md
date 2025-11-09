# ✅ Setup Checklist - HOLY BIBLE

Checklist untuk memastikan setup aplikasi HOLY BIBLE sudah benar dan lengkap.

## 📋 Pre-Installation Checklist

- [ ] Node.js 20+ terinstall
  ```bash
  node --version  # Harus 20.x atau lebih tinggi
  ```
- [ ] npm atau yarn terinstall
  ```bash
  npm --version
  ```
- [ ] Docker terinstall dan running
  ```bash
  docker --version
  docker ps  # Harus tidak error
  ```
- [ ] Docker Compose terinstall
  ```bash
  docker compose version
  ```
- [ ] Git terinstall
  ```bash
  git --version
  ```

## 📦 Installation Checklist

- [ ] Repository sudah di-clone
  ```bash
  git clone https://github.com/yourusername/HOLY_BIBLE.git
  cd HOLY_BIBLE
  ```
- [ ] Dependencies backend terinstall
  ```bash
  npm install
  ```
- [ ] Dependencies frontend terinstall
  ```bash
  cd frontend
  npm install
  cd ..
  ```

## ⚙️ Configuration Checklist

### Environment Variables

- [ ] File `.env` sudah dibuat di root
  ```bash
  cp env.template .env
  ```
- [ ] File `frontend/.env` sudah dibuat
  ```bash
  cp frontend/env.template frontend/.env
  ```
- [ ] `DATABASE_URL` sudah dikonfigurasi
- [ ] `REDIS_URL` sudah dikonfigurasi
- [ ] `MEILI_HOST` dan `MEILI_API_KEY` sudah dikonfigurasi
- [ ] `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` sudah dikonfigurasi
- [ ] `JWT_PRIVATE_KEY` sudah di-set (untuk production, gunakan random string)
- [ ] `PORT` sudah di-set (default: 4000)
- [ ] `VITE_API_URL` di frontend sudah di-set

## 🐳 Docker Services Checklist

- [ ] PostgreSQL container running
  ```bash
  docker compose ps postgres
  ```
- [ ] Redis container running
  ```bash
  docker compose ps redis
  ```
- [ ] Meilisearch container running
  ```bash
  docker compose ps meilisearch
  ```
- [ ] MinIO container running
  ```bash
  docker compose ps minio
  ```
- [ ] Semua services accessible:
  - [ ] PostgreSQL: `localhost:5432`
  - [ ] Redis: `localhost:6379`
  - [ ] Meilisearch: `http://localhost:7700`
  - [ ] MinIO: `http://localhost:9000`

## 🗄️ Database Checklist

- [ ] Prisma Client sudah di-generate
  ```bash
  npm run prisma:generate
  ```
- [ ] Database migrations sudah dijalankan
  ```bash
  npm run prisma:migrate
  ```
- [ ] (Optional) Sample data sudah di-seed
  ```bash
  npm run seed:sample
  ```
- [ ] Database connection berhasil
  ```bash
  # Test dengan menjalankan backend
  npm run dev
  # Tidak ada error database connection
  ```

## 🚀 Application Checklist

### Backend

- [ ] Backend bisa di-build
  ```bash
  npm run build
  ```
- [ ] Backend bisa dijalankan
  ```bash
  npm run dev
  ```
- [ ] Server berjalan di `http://localhost:4000`
- [ ] API Docs accessible di `http://localhost:4000/docs`
- [ ] Health check endpoint berfungsi
  ```bash
  curl http://localhost:4000/health
  ```

### Frontend

- [ ] Frontend bisa di-build
  ```bash
  cd frontend
  npm run build
  ```
- [ ] Frontend bisa dijalankan
  ```bash
  npm run dev
  ```
- [ ] Frontend berjalan di `http://localhost:5173`
- [ ] Frontend bisa connect ke backend API
- [ ] Tidak ada error di browser console

## 🔐 Authentication Checklist

- [ ] Register endpoint berfungsi
  ```bash
  curl -X POST http://localhost:4000/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
  ```
- [ ] Login endpoint berfungsi
  ```bash
  curl -X POST http://localhost:4000/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```
- [ ] JWT token diterima setelah login
- [ ] Protected routes memerlukan authentication

## 📖 Features Checklist

- [ ] Bible Reader page bisa diakses
- [ ] Search functionality berfungsi
- [ ] Bookmarks bisa dibuat (setelah login)
- [ ] Annotations bisa dibuat (setelah login)
- [ ] Multi-language switching berfungsi
- [ ] Dark mode toggle berfungsi
- [ ] Responsive design bekerja di mobile

## 🔍 Search & Indexing Checklist

- [ ] Meilisearch index sudah dibuat
- [ ] Verses sudah ter-index
- [ ] Search endpoint berfungsi
  ```bash
  curl "http://localhost:4000/v1/search?q=love&limit=10"
  ```
- [ ] Search results relevan

## 📦 File Upload Checklist (Optional)

- [ ] MinIO/S3 connection berhasil
- [ ] Upload endpoint accessible (admin only)
- [ ] Files bisa di-upload dan di-download

## 🧪 Testing Checklist

- [ ] Tidak ada linter errors
  ```bash
  npm run lint
  ```
- [ ] TypeScript compilation berhasil
  ```bash
  npm run build
  ```
- [ ] Tidak ada error di console (backend & frontend)
- [ ] API endpoints return expected responses

## 🚢 Production Readiness Checklist

- [ ] Environment variables untuk production sudah di-set
- [ ] `JWT_PRIVATE_KEY` menggunakan random secure string
- [ ] `NODE_ENV=production`
- [ ] CORS origins sudah dikonfigurasi
- [ ] Database backup strategy sudah ada
- [ ] Logging sudah dikonfigurasi
- [ ] Error handling sudah proper
- [ ] Security headers sudah di-set
- [ ] Rate limiting sudah di-implement (jika perlu)

## ✅ Final Verification

- [ ] Semua checklist di atas sudah dicentang
- [ ] Aplikasi berjalan tanpa error
- [ ] Fitur utama berfungsi dengan baik
- [ ] Dokumentasi sudah dibaca

---

## 🎉 Setup Complete!

Jika semua checklist sudah dicentang, selamat! Setup Anda sudah lengkap dan siap digunakan.

### Next Steps:
1. 📖 Baca [Quick Start Guide](./QUICK_START.md) untuk mulai menggunakan
2. 🛠️ Lihat [Command Reference](./COMMANDS.md) untuk command yang sering digunakan
3. 📚 Baca [Panduan Lengkap](./PANDUAN_MENJALANKAN.md) untuk detail lebih lanjut

---

**Happy Coding! 🚀**

