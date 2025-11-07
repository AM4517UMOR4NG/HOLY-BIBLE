# 📚 Index Dokumentasi Holy Bible

Panduan lengkap untuk navigasi semua dokumentasi yang tersedia.

---

## 🚀 Untuk Pemula (Mulai dari sini!)

### 1. [⚡ Quick Start Guide](./QUICK_START.md)
**Waktu baca: 5 menit**

Panduan tercepat untuk menjalankan aplikasi. Cocok untuk:
- Developer yang ingin cepat setup
- Testing aplikasi pertama kali
- Demo atau presentasi

**Isi:**
- 5 langkah setup cepat
- Command minimal yang dibutuhkan
- Link ke dokumentasi lengkap

---

### 2. [✅ Setup Checklist](./SETUP_CHECKLIST.md)
**Waktu baca: 10 menit**

Checklist lengkap untuk memastikan setup berhasil. Cocok untuk:
- Memastikan tidak ada langkah yang terlewat
- Debugging saat setup gagal
- Onboarding developer baru

**Isi:**
- Pre-installation checklist
- Installation steps
- Database setup checklist
- Running services checklist
- Testing checklist
- Optional services checklist

---

## 📖 Dokumentasi Lengkap

### 3. [📖 Panduan Menjalankan](./PANDUAN_MENJALANKAN.md)
**Waktu baca: 20-30 menit**

Dokumentasi lengkap dan detail. Cocok untuk:
- Setup production
- Memahami arsitektur aplikasi
- Troubleshooting masalah
- Reference lengkap

**Isi:**
- Persyaratan sistem detail
- Struktur proyek
- Setup environment variables
- Database setup (Docker & manual)
- Running backend & frontend
- Troubleshooting lengkap
- Security best practices
- Performance tips

---

## 🛠️ Reference & Tools

### 4. [🛠️ Command Reference](./COMMANDS.md)
**Waktu baca: 15 menit**

Daftar lengkap semua command yang dibutuhkan. Cocok untuk:
- Quick reference saat development
- Copy-paste command
- Learning command-line tools

**Isi:**
- Installation commands
- Running services
- Database commands (Prisma)
- Docker commands
- Testing & debugging
- Cleanup commands
- Monitoring commands
- Security commands
- Git commands (bonus)
- Quick cheat sheet

---

### 5. [Environment Variables Template](./env.template)

Template untuk file `.env` backend. Berisi:
- Semua environment variables yang dibutuhkan
- Penjelasan setiap variable
- Nilai default untuk development
- Catatan keamanan

### 6. [Frontend Environment Template](./frontend/env.template)

Template untuk file `.env` frontend. Berisi:
- API URL configuration
- Feature flags
- Analytics configuration

---

## 🎯 Helper Scripts

### 7. [start-all.bat](./start-all.bat) (Windows)
Script untuk menjalankan backend dan frontend sekaligus di Windows.

**Cara pakai:**
```bash
start-all.bat
```

### 8. [start-all.sh](./start-all.sh) (Linux/Mac)
Script untuk menjalankan backend dan frontend sekaligus di Linux/Mac.

**Cara pakai:**
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## 📄 Dokumentasi Teknis

### 9. [README.md](./README.md)
Dokumentasi utama proyek (English). Berisi:
- Overview proyek
- Quick start
- API contract
- Background workers
- JSON import format

### 10. [Frontend README](./frontend/README.md)
Dokumentasi frontend (English). Berisi:
- Features
- Tech stack
- Project structure
- Available scripts

### 11. [OpenAPI Specification](./openapi.yaml)
Spesifikasi API lengkap dalam format OpenAPI 3.0.

**Cara lihat:**
- Buka http://localhost:4000/docs (saat server berjalan)
- Import ke Postman/Insomnia
- Generate client code

### 12. [Database Schema](./prisma/schema.prisma)
Schema database Prisma. Berisi:
- Model definitions
- Relations
- Indexes
- Constraints

---

## 🗺️ Roadmap Belajar

### Level 1: Pemula (Hari 1)
1. ✅ Baca [Quick Start Guide](./QUICK_START.md)
2. ✅ Ikuti [Setup Checklist](./SETUP_CHECKLIST.md)
3. ✅ Jalankan aplikasi pertama kali
4. ✅ Explore frontend di browser
5. ✅ Coba API di Swagger UI

### Level 2: Intermediate (Hari 2-3)
1. 📖 Baca [Panduan Lengkap](./PANDUAN_MENJALANKAN.md)
2. 🛠️ Pelajari [Command Reference](./COMMANDS.md)
3. 🔧 Setup Docker services
4. 🗄️ Pelajari Prisma commands
5. 🧪 Test semua API endpoints

### Level 3: Advanced (Minggu 1-2)
1. 📄 Pelajari [OpenAPI Spec](./openapi.yaml)
2. 🗃️ Pelajari [Database Schema](./prisma/schema.prisma)
3. 🔐 Setup authentication & authorization
4. 🚀 Deploy ke production
5. 📊 Setup monitoring & logging

---

## 🎯 Skenario Penggunaan

### Skenario 1: "Saya ingin cepat test aplikasi"
→ Ikuti [Quick Start Guide](./QUICK_START.md)

### Skenario 2: "Setup saya gagal, ada error"
→ Cek [Troubleshooting](./PANDUAN_MENJALANKAN.md#troubleshooting) di Panduan Lengkap

### Skenario 3: "Saya lupa command untuk X"
→ Lihat [Command Reference](./COMMANDS.md)

### Skenario 4: "Saya ingin setup production"
→ Baca [Panduan Lengkap](./PANDUAN_MENJALANKAN.md) bagian Production

### Skenario 5: "Saya ingin tahu API endpoints apa saja"
→ Buka [Swagger UI](http://localhost:4000/docs) atau [OpenAPI Spec](./openapi.yaml)

### Skenario 6: "Saya ingin modifikasi database"
→ Edit [Prisma Schema](./prisma/schema.prisma) dan lihat [Command Reference](./COMMANDS.md#database-commands)

### Skenario 7: "Saya ingin onboard developer baru"
→ Berikan [Setup Checklist](./SETUP_CHECKLIST.md) dan [Quick Start Guide](./QUICK_START.md)

---

## 📞 Bantuan & Support

### Jika masih bingung:

1. **Cek dokumentasi yang relevan** dari list di atas
2. **Search di dokumentasi** (Ctrl+F)
3. **Cek Troubleshooting** di Panduan Lengkap
4. **Buka issue** di repository
5. **Tanya tim development**

### Urutan troubleshooting:

```
Error terjadi
    ↓
Cek log error di terminal
    ↓
Search error di Troubleshooting section
    ↓
Cek Command Reference untuk command yang benar
    ↓
Restart services
    ↓
Masih error? Buka issue
```

---

## 🔄 Update Dokumentasi

Dokumentasi ini akan terus diupdate. Cek:
- Git commit history untuk perubahan
- README.md untuk update terbaru
- CHANGELOG.md (jika ada)

---

## ✨ Tips Produktivitas

1. **Bookmark dokumentasi** yang sering dipakai
2. **Print Setup Checklist** untuk onboarding
3. **Simpan Command Reference** di bookmark
4. **Gunakan helper scripts** untuk development
5. **Baca Troubleshooting** sebelum coding

---

## 📊 Statistik Dokumentasi

- **Total Files**: 12 dokumentasi
- **Total Halaman**: ~100 halaman
- **Bahasa**: Indonesia & English
- **Coverage**: Setup, Development, Production, Troubleshooting
- **Update Terakhir**: 2025-01-06

---

**Selamat belajar dan happy coding! 🚀**
