# ✅ Setup Checklist

Gunakan checklist ini untuk memastikan semua langkah setup sudah dilakukan dengan benar.

---

## 📋 Pre-Installation

- [ ] Node.js versi 20+ sudah terinstall
  ```bash
  node --version
  ```
- [ ] npm sudah terinstall
  ```bash
  npm --version
  ```
- [ ] PostgreSQL sudah terinstall atau Docker tersedia
- [ ] Git sudah terinstall (untuk clone repository)

---

## 📦 Installation

### Backend
- [ ] Clone repository
- [ ] Masuk ke folder project
- [ ] Jalankan `npm install` di root folder
- [ ] Buat file `.env` di root folder
- [ ] Isi semua environment variables yang diperlukan

### Frontend
- [ ] Masuk ke folder `frontend/`
- [ ] Jalankan `npm install`
- [ ] Buat file `.env` di folder `frontend/`
- [ ] Set `VITE_API_URL=http://localhost:4000`

---

## 🗄️ Database Setup

- [ ] PostgreSQL berjalan (cek dengan `docker compose ps` atau manual)
- [ ] Database `holybible` sudah dibuat
- [ ] User database sudah dibuat dengan permissions yang benar
- [ ] Connection string di `.env` sudah benar
- [ ] Jalankan `npx prisma generate`
- [ ] Jalankan `npx prisma migrate dev --name init`
- [ ] (Opsional) Jalankan seed data: `npm run seed:sample`

---

## 🚀 Running Services

### Backend
- [ ] Backend bisa dijalankan dengan `npm run dev`
- [ ] Backend berjalan di `http://localhost:4000`
- [ ] Tidak ada error di console (Redis error boleh diabaikan)
- [ ] Swagger docs bisa diakses di `http://localhost:4000/docs`
- [ ] Health check endpoint berhasil: `http://localhost:4000/health`

### Frontend
- [ ] Frontend bisa dijalankan dengan `npm run dev`
- [ ] Frontend berjalan di `http://localhost:5173`
- [ ] Tidak ada error di console
- [ ] Halaman utama bisa dibuka di browser
- [ ] Tidak ada CORS error saat akses API

---

## 🧪 Testing

### Backend API
- [ ] Health check berhasil
  ```bash
  curl http://localhost:4000/health
  ```
- [ ] Swagger UI bisa dibuka
- [ ] Register user berhasil (via Swagger atau Postman)
- [ ] Login berhasil dan mendapat token
- [ ] Protected endpoints bisa diakses dengan token

### Frontend
- [ ] Halaman home bisa dibuka
- [ ] Navigation berfungsi
- [ ] Search berfungsi
- [ ] Bible reader berfungsi
- [ ] Dark mode toggle berfungsi

---

## 🔧 Optional Services

### Redis (untuk background jobs)
- [ ] Redis berjalan di `localhost:6379`
- [ ] `REDIS_URL` sudah di set di `.env`
- [ ] Background jobs berfungsi
- [ ] Job queue bisa dimonitor

### Meilisearch (untuk search)
- [ ] Meilisearch berjalan di `http://localhost:7700`
- [ ] `MEILI_HOST` dan `MEILI_API_KEY` sudah di set
- [ ] Index sudah dibuat
- [ ] Search berfungsi dengan baik

### MinIO (untuk file upload)
- [ ] MinIO berjalan di `http://localhost:9000`
- [ ] S3 credentials sudah di set di `.env`
- [ ] Bucket sudah dibuat
- [ ] File upload berfungsi

---

## 📝 Documentation

- [ ] README.md sudah dibaca
- [ ] QUICK_START.md sudah dibaca
- [ ] PANDUAN_MENJALANKAN.md sudah dibaca (untuk detail lengkap)
- [ ] Environment variables sudah dipahami
- [ ] API endpoints sudah dipahami

---

## 🎯 Final Check

- [ ] Backend berjalan tanpa error
- [ ] Frontend berjalan tanpa error
- [ ] Frontend bisa berkomunikasi dengan backend
- [ ] Bisa register user baru
- [ ] Bisa login
- [ ] Bisa membaca Alkitab
- [ ] Bisa search ayat
- [ ] (Opsional) Bisa bookmark ayat
- [ ] (Opsional) Bisa menambah catatan

---

## 🎉 Setup Complete!

Jika semua checklist sudah ✅, maka setup sudah berhasil!

### Next Steps:

1. Explore API documentation di Swagger UI
2. Test semua fitur aplikasi
3. Baca dokumentasi untuk development
4. Mulai coding! 🚀

---

## ❌ Jika Ada Masalah

Jika ada item yang belum ✅:

1. Cek bagian **Troubleshooting** di [PANDUAN_MENJALANKAN.md](./PANDUAN_MENJALANKAN.md)
2. Cek log error di terminal
3. Pastikan semua dependencies terinstall
4. Restart services
5. Buka issue jika masalah persist

---

**Good luck! 🙏**
