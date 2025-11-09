<div align="center">

# ✨ HOLY BIBLE ✨

### 📖 Platform Digital Alkitab Modern & Interaktif

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Baca, Cari, dan Renungkan Firman Tuhan dengan Platform Digital Terdepan**

[🚀 Quick Start](#-quick-start) • [📚 Dokumentasi](#-dokumentasi) • [✨ Fitur](#-fitur-utama) • [🏗️ Arsitektur](#️-arsitektur) • [🤝 Kontribusi](#-kontribusi)

---

</div>

## 🌟 Tentang Proyek

**HOLY BIBLE** adalah platform digital Alkitab modern yang dirancang untuk memberikan pengalaman membaca, mempelajari, dan merenungkan Firman Tuhan yang luar biasa. Dibangun dengan teknologi terdepan, aplikasi ini menawarkan antarmuka yang indah, performa tinggi, dan fitur-fitur canggih untuk mendukung perjalanan rohani Anda.

### 🎯 Visi
Menyediakan akses mudah, cepat, dan interaktif terhadap Alkitab dalam berbagai bahasa dan versi, dengan teknologi modern yang memudahkan setiap orang untuk terhubung dengan Firman Tuhan.

---

## ✨ Fitur Utama

### 📖 **Pembaca Alkitab**
- ✅ Antarmuka yang bersih dan bebas gangguan
- ✅ Navigasi mudah antar kitab, pasal, dan ayat
- ✅ Dukungan multi-versi Alkitab (KJV, TB, dll)
- ✅ Mode malam untuk membaca yang nyaman
- ✅ Responsif di semua perangkat (Desktop, Tablet, Mobile)

### 🔍 **Pencarian Canggih**
- ✅ Pencarian full-text yang cepat dan akurat
- ✅ Filter berdasarkan versi dan bahasa
- ✅ Hasil pencarian yang relevan dengan highlight
- ✅ Powered by Meilisearch untuk performa optimal

### 🔖 **Bookmarks & Annotations**
- ✅ Simpan ayat favorit dengan mudah
- ✅ Tambahkan catatan pribadi pada setiap ayat
- ✅ Organisasi bookmark yang rapi
- ✅ Sinkronisasi data pengguna

### 🌍 **Multi-Language Support**
- ✅ **Bahasa Indonesia** 🇮🇩
- ✅ **English** 🇬🇧
- ✅ **Español** 🇪🇸
- ✅ **Português** 🇵🇹
- ✅ **中文** 🇨🇳
- ✅ **한국어** 🇰🇷

### 🔐 **Authentication & Security**
- ✅ Sistem autentikasi JWT yang aman
- ✅ Refresh token untuk keamanan ekstra
- ✅ Role-based access control (USER, EDITOR, ADMIN)
- ✅ Session management yang robust

### 📱 **Fitur Tambahan**
- ✅ **Daily Verse** - Ayat harian untuk inspirasi
- ✅ **Prayer** - Halaman doa pribadi
- ✅ **Notes** - Catatan pribadi Anda
- ✅ **Reading Plan** - Rencana membaca Alkitab
- ✅ **Dark Mode** - Tema gelap untuk kenyamanan mata

---

## 🏗️ Arsitektur

### **Backend Stack**
```
┌─────────────────────────────────────────┐
│         Fastify API Server              │
│  (TypeScript + Fastify + Zod)           │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼────┐
│Prisma │ │Redis  │ │Meili   │
│ORM    │ │Queue  │ │Search  │
└───┬───┘ └───┬───┘ └───┬────┘
    │          │          │
┌───▼──────────▼──────────▼───┐
│   PostgreSQL / SQLite        │
│   (Database)                │
└──────────────────────────────┘
```

**Teknologi Backend:**
- 🚀 **Fastify** - Web framework yang sangat cepat
- 🗄️ **Prisma** - Next-generation ORM
- 🔍 **Meilisearch** - Search engine yang powerful
- 📦 **BullMQ** - Job queue dengan Redis
- ☁️ **MinIO/S3** - Object storage
- 🔐 **JWT** - Authentication & Authorization
- 📝 **Zod** - Schema validation

### **Frontend Stack**
```
┌─────────────────────────────────────┐
│      React 19 + TypeScript          │
│  (Vite + TailwindCSS + i18next)    │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼────┐
│React  │ │Tailwind│ │i18next │
│Router │ │CSS     │ │i18n    │
└───────┘ └────────┘ └────────┘
```

**Teknologi Frontend:**
- ⚛️ **React 19** - UI library terbaru
- 🎨 **TailwindCSS** - Utility-first CSS
- 🌐 **i18next** - Internationalization
- ⚡ **Vite** - Next-gen build tool
- 🎯 **TypeScript** - Type safety
- 🎭 **Lucide React** - Beautiful icons

---

## 🚀 Quick Start

### **Prasyarat**
- Node.js 20+ 
- Docker & Docker Compose
- npm atau yarn

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/HOLY_BIBLE.git
cd HOLY_BIBLE
```

### **2. Setup Environment Variables**

**Backend** - Buat file `.env` di root:
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

**Frontend** - Buat file `.env` di `frontend/`:
```env
VITE_API_URL=http://localhost:4000
```

### **3. Start Infrastructure Services**
```bash
# Start semua services (PostgreSQL, Redis, Meilisearch, MinIO)
docker compose up -d
```

**Services yang berjalan:**
- 🐘 **PostgreSQL**: `localhost:5432`
- 🔴 **Redis**: `localhost:6379`
- 🔍 **Meilisearch**: `http://localhost:7700`
- 📦 **MinIO**: `http://localhost:9000`

### **4. Setup Database**
```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run seed:sample
```

### **5. Start Development Servers**

**Backend:**
```bash
npm run dev
# Server berjalan di http://localhost:4000
# API Docs: http://localhost:4000/docs
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend berjalan di http://localhost:5173
```

### **6. Atau Gunakan Script Otomatis**

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

## 📚 Dokumentasi

### 🇮🇩 **Bahasa Indonesia**
- **[⚡ Quick Start Guide](./QUICK_START.md)** - Panduan cepat 5 menit
- **[📖 Panduan Lengkap](./PANDUAN_MENJALANKAN.md)** - Dokumentasi lengkap dengan troubleshooting
- **[✅ Setup Checklist](./SETUP_CHECKLIST.md)** - Checklist untuk memastikan setup benar
- **[🛠️ Command Reference](./COMMANDS.md)** - Daftar lengkap command yang sering digunakan
- **[🚀 Quick Deploy Guide](./QUICK_DEPLOY_GUIDE.md)** - Panduan deploy cepat

### 🔐 **Authentication**
- **[🚀 Quick Reference](./AUTH_QUICK_REFERENCE.md)** - Quick API reference untuk auth
- **[📖 API Testing Guide](./AUTH_API_TESTING.md)** - Comprehensive testing documentation
- **[✨ Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)** - Fitur & implementation details

### 🇬🇧 **English**
- **[Frontend Documentation](./frontend/README.md)** - Frontend specific docs
- **[API Documentation](http://localhost:4000/docs)** - Swagger UI (when server is running)

### 🔧 **Templates & Scripts**
- **[Backend .env Template](./env.template)** - Environment variables template
- **[Frontend .env Template](./frontend/env.template)** - Frontend environment template

---

## 🛠️ API Endpoints

### **Authentication**
```
POST   /v1/auth/register     - Register user baru
POST   /v1/auth/login        - Login user
POST   /v1/auth/refresh      - Refresh access token
POST   /v1/auth/logout       - Logout user
GET    /v1/auth/me           - Get current user
```

### **Bible**
```
GET    /v1/versions                          - List semua versi Alkitab
GET    /v1/versions/:code/books              - List kitab dalam versi
GET    /v1/versions/:code/books/:id/chapters/:num  - Get pasal dengan ayat
GET    /v1/id-bible/:book/:chapter           - Indonesian Bible (Terjemahan Baru)
```

### **Search**
```
GET    /v1/search?q=query&version=KJV        - Pencarian full-text
```

### **Bookmarks & Annotations**
```
GET    /v1/bookmarks                         - List bookmarks user
POST   /v1/bookmarks                         - Create bookmark
DELETE /v1/bookmarks/:id                     - Delete bookmark
GET    /v1/annotations                       - List annotations user
POST   /v1/annotations                       - Create annotation
PUT    /v1/annotations/:id                   - Update annotation
DELETE /v1/annotations/:id                   - Delete annotation
```

### **Admin**
```
POST   /v1/admin/import                      - Import Bible version (JSON)
GET    /v1/admin/jobs/:id                    - Check import job status
```

📖 **Full API Documentation**: [Swagger UI](http://localhost:4000/docs)

---

## 🧪 Testing

### **Backend Testing**
```bash
# Run tests (jika tersedia)
npm test

# Test authentication
node test-auth.js

# Test registration
node test-register-interactive.js
```

### **API Testing dengan cURL**
```bash
# Register user
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User"}'

# Login
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Search Bible
curl "http://localhost:4000/v1/search?q=love&limit=10"
```

---

## 📦 Build & Deploy

### **Build Production**

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### **Docker Deployment**
```bash
# Build image
docker build -t holy-bible-backend .

# Run dengan docker-compose
docker compose up -d
```

### **Deploy ke Platform**

- **Vercel**: Lihat [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- **Railway**: Konfigurasi di `railway.json`
- **Render**: Konfigurasi di `render.yaml`

---

## 🗂️ Struktur Proyek

```
HOLY_BIBLE/
├── src/                    # Backend source code
│   ├── routes/           # API routes
│   ├── lib/              # Libraries (Prisma, Meili, S3, Auth)
│   ├── plugins/          # Fastify plugins
│   ├── services/         # Business logic
│   ├── workers/          # Background workers
│   ├── queues/           # Job queues
│   └── utils/            # Utilities
├── frontend/             # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # API clients & utils
│   │   ├── contexts/     # React contexts
│   │   └── locales/      # i18n translations
│   └── public/           # Static assets
├── prisma/               # Database schema & migrations
├── scripts/              # Utility scripts
│   └── seed/            # Database seeding
├── docker-compose.yml    # Docker services
├── Dockerfile           # Backend Docker image
└── openapi.yaml         # API specification
```

---

## 🎨 Screenshots

> 📸 _Screenshots akan ditambahkan segera_

- 🖼️ Bible Reader Interface
- 🔍 Search Results
- 🔖 Bookmarks Page
- 📝 Annotations Editor
- 🌐 Multi-language Support
- 📱 Mobile Responsive Design

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Proyek ini dibangun dengan cinta untuk komunitas. 

### **Cara Berkontribusi:**
1. 🍴 Fork repository
2. 🌿 Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push ke branch (`git push origin feature/AmazingFeature`)
5. 🔀 Buka Pull Request

### **Guidelines:**
- ✅ Ikuti code style yang ada
- ✅ Tambahkan tests untuk fitur baru
- ✅ Update dokumentasi jika perlu
- ✅ Pastikan semua tests pass

---

## 📄 License

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

## 🙏 Acknowledgments

- **Alkitab** - Firman Tuhan yang menjadi sumber utama
- **Komunitas Open Source** - Untuk semua library dan tools yang digunakan
- **Kontributor** - Semua yang telah membantu mengembangkan proyek ini

---

## 📞 Support 
- 📧 **Email**: aekmohop@gmail.com

---

## ⭐ Star History

Jika proyek ini membantu Anda, pertimbangkan untuk memberikan ⭐ di GitHub!

---

<div align="center">

### 🌟 Dibuat dengan SEMANGAT untuk Komunitas

**"I am the way, the truth, and the life"** - John 14:6

[⬆ Kembali ke atas](#-holy-bible-)

</div>
