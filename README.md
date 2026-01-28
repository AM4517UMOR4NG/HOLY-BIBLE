# HOLY BIBLE

Platform Digital Alkitab Modern & Interaktif

---

## Tentang Proyek

HOLY BIBLE adalah platform digital Alkitab modern yang dirancang untuk memberikan pengalaman membaca, mempelajari, dan merenungkan Firman Tuhan. Dibangun dengan teknologi terdepan, aplikasi ini menawarkan antarmuka yang bersih, performa tinggi, dan fitur-fitur untuk mendukung perjalanan rohani Anda.

### Visi

Menyediakan akses mudah, cepat, dan interaktif terhadap Alkitab dalam berbagai bahasa dan versi.

---

## Fitur Utama

### Pembaca Alkitab
- Antarmuka yang bersih dan bebas gangguan
- Navigasi mudah antar kitab, pasal, dan ayat
- Dukungan multi-versi Alkitab (KJV, TB, dll)
- Mode malam untuk membaca yang nyaman
- Responsif di semua perangkat

### Pencarian
- Pencarian full-text yang cepat dan akurat
- Filter berdasarkan versi dan bahasa
- Hasil pencarian dengan highlight
- Powered by Meilisearch

### Bookmarks & Annotations
- Simpan ayat favorit
- Tambahkan catatan pribadi pada setiap ayat
- Sinkronisasi data pengguna

### Multi-Language Support
- Bahasa Indonesia
- English
- Espanol
- Portugues
- Chinese
- Korean

### Authentication & Security
- Sistem autentikasi JWT
- Refresh token
- Role-based access control (USER, EDITOR, ADMIN)

### Fitur Tambahan
- Daily Verse - Ayat harian
- Prayer - Halaman doa pribadi
- Notes - Catatan pribadi
- Reading Plan - Rencana membaca Alkitab
- Dark Mode

---

## Arsitektur

### Backend Stack

```
Fastify API Server (TypeScript + Fastify + Zod)
        |
   +---------+---------+
   |         |         |
Prisma    Redis    Meilisearch
   |         |         |
   +---------+---------+
             |
    PostgreSQL / SQLite
```

**Teknologi Backend:**
- Fastify - Web framework
- Prisma - ORM
- Meilisearch - Search engine
- BullMQ - Job queue dengan Redis
- MinIO/S3 - Object storage
- JWT - Authentication
- Zod - Schema validation

### Frontend Stack

```
React 19 + TypeScript (Vite + TailwindCSS + i18next)
        |
   +---------+---------+
   |         |         |
React     Tailwind   i18next
Router    CSS        i18n
```

**Teknologi Frontend:**
- React 19
- TailwindCSS
- i18next
- Vite
- TypeScript
- Lucide React

---

## Quick Start

### Prasyarat
- Node.js 20+
- Docker & Docker Compose
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/HOLY_BIBLE.git
cd HOLY_BIBLE
```

### 2. Setup Environment Variables

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

### 3. Start Infrastructure Services

```bash
docker compose up -d
```

Services yang berjalan:
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Meilisearch: http://localhost:7700
- MinIO: http://localhost:9000

### 4. Setup Database

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed:sample  # Optional
```

### 5. Start Development Servers

**Backend:**

```bash
npm run dev
# Server: http://localhost:4000
# API Docs: http://localhost:4000/docs
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

### 6. Script Otomatis

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

## Dokumentasi

### Bahasa Indonesia
- [Quick Start Guide](./QUICK_START.md)
- [Panduan Lengkap](./PANDUAN_MENJALANKAN.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)
- [Command Reference](./COMMANDS.md)
- [Quick Deploy Guide](./QUICK_DEPLOY_GUIDE.md)

### Authentication
- [Quick Reference](./AUTH_QUICK_REFERENCE.md)
- [API Testing Guide](./AUTH_API_TESTING.md)
- [Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)

### English
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](http://localhost:4000/docs)

### Templates
- [Backend .env Template](./env.template)
- [Frontend .env Template](./frontend/env.template)

---

## API Endpoints

### Authentication

```
POST   /v1/auth/register     - Register user baru
POST   /v1/auth/login        - Login user
POST   /v1/auth/refresh      - Refresh access token
POST   /v1/auth/logout       - Logout user
GET    /v1/auth/me           - Get current user
```

### Bible

```
GET    /v1/versions                          - List semua versi Alkitab
GET    /v1/versions/:code/books              - List kitab dalam versi
GET    /v1/versions/:code/books/:id/chapters/:num  - Get pasal dengan ayat
GET    /v1/id-bible/:book/:chapter           - Indonesian Bible
```

### Search

```
GET    /v1/search?q=query&version=KJV        - Pencarian full-text
```

### Bookmarks & Annotations

```
GET    /v1/bookmarks                         - List bookmarks user
POST   /v1/bookmarks                         - Create bookmark
DELETE /v1/bookmarks/:id                     - Delete bookmark
GET    /v1/annotations                       - List annotations user
POST   /v1/annotations                       - Create annotation
PUT    /v1/annotations/:id                   - Update annotation
DELETE /v1/annotations/:id                   - Delete annotation
```

### Admin

```
POST   /v1/admin/import                      - Import Bible version (JSON)
GET    /v1/admin/jobs/:id                    - Check import job status
```

Full API Documentation: [Swagger UI](http://localhost:4000/docs)

---

## Testing

### Backend Testing

```bash
npm test
node test-auth.js
node test-register-interactive.js
```

### API Testing dengan cURL

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

## Build & Deploy

### Build Production

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

### Docker Deployment

```bash
docker build -t holy-bible-backend .
docker compose up -d
```

### Deploy ke Platform

- Vercel: Lihat [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- Railway: Konfigurasi di `railway.json`
- Render: Konfigurasi di `render.yaml`

---

## Struktur Proyek

```
HOLY_BIBLE/
├── src/                    # Backend source code
│   ├── routes/             # API routes
│   ├── lib/                # Libraries (Prisma, Meili, S3, Auth)
│   ├── plugins/            # Fastify plugins
│   ├── services/           # Business logic
│   ├── workers/            # Background workers
│   ├── queues/             # Job queues
│   └── utils/              # Utilities
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # API clients & utils
│   │   ├── contexts/       # React contexts
│   │   └── locales/        # i18n translations
│   └── public/             # Static assets
├── prisma/                 # Database schema & migrations
├── scripts/                # Utility scripts
│   └── seed/               # Database seeding
├── docker-compose.yml      # Docker services
├── Dockerfile              # Backend Docker image
└── openapi.yaml            # API specification
```

---

## Kontribusi

Kontribusi sangat diterima!

### Cara Berkontribusi:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

### Guidelines:
- Ikuti code style yang ada
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika perlu
- Pastikan semua tests pass

---

## License

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

## Support

Email: aekmohop@gmail.com

---

*"I am the way, the truth, and the life" - John 14:6*
