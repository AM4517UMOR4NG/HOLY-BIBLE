# 🛠️ Command Reference - HOLY BIBLE

Daftar lengkap command yang sering digunakan dalam development HOLY BIBLE.

## 📦 Package Management

### Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend && npm install
```

### Update Dependencies
```bash
# Backend
npm update

# Frontend
cd frontend && npm update
```

---

## 🚀 Development

### Start Development Server

**Backend:**
```bash
npm run dev
# Server: http://localhost:4000
# API Docs: http://localhost:4000/docs
```

**Frontend:**
```bash
cd frontend
npm run dev
# Frontend: http://localhost:5173
```

### Build for Production

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

---

## 🗄️ Database Commands

### Prisma Commands

**Generate Prisma Client:**
```bash
npm run prisma:generate
# atau
npx prisma generate
```

**Create Migration:**
```bash
npm run prisma:migrate
# atau
npx prisma migrate dev --name <migration_name>
```

**Reset Database:**
```bash
npx prisma migrate reset
# ⚠️ HATI-HATI: Akan menghapus semua data!
```

**View Database:**
```bash
npx prisma studio
# Membuka Prisma Studio di browser
```

**Format Schema:**
```bash
npx prisma format
```

**Validate Schema:**
```bash
npx prisma validate
```

### Seed Database

**Seed Sample Data:**
```bash
npm run seed:sample
```

**Custom Seed:**
```bash
ts-node scripts/seed/seed.ts <path_to_json_file>
```

---

## 🐳 Docker Commands

### Start Services
```bash
# Start semua services
docker compose up -d

# Start specific service
docker compose up -d postgres
docker compose up -d redis
docker compose up -d meilisearch
docker compose up -d minio
```

### Stop Services
```bash
# Stop semua services
docker compose down

# Stop specific service
docker compose stop postgres
```

### View Logs
```bash
# Semua services
docker compose logs -f

# Specific service
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f meilisearch
```

### Check Status
```bash
docker compose ps
```

### Restart Services
```bash
# Restart semua
docker compose restart

# Restart specific
docker compose restart postgres
```

### Remove Containers & Volumes
```bash
# Stop dan remove containers
docker compose down -v

# ⚠️ HATI-HATI: Akan menghapus semua data di volumes!
```

---

## 🧪 Testing Commands

### Linting
```bash
# Backend
npm run lint

# Frontend
cd frontend && npm run lint
```

### Type Checking
```bash
# Backend (TypeScript)
npx tsc --noEmit

# Frontend
cd frontend && npx tsc --noEmit
```

### Test Authentication
```bash
# Test register
node test-register-interactive.js

# Test login
node test-auth.js
```

---

## 🔍 Debugging Commands

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :4000

# Mac/Linux
lsof -i :4000
```

### Kill Process
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

### Check Environment Variables
```bash
# Windows
type .env

# Mac/Linux
cat .env
```

---

## 📡 API Testing Commands

### Health Check
```bash
curl http://localhost:4000/health
```

### Register User
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User Name"}'
```

### Login
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Search Bible
```bash
curl "http://localhost:4000/v1/search?q=love&limit=10"
```

### Get Bible Versions
```bash
curl http://localhost:4000/v1/versions
```

### Get Books (with auth token)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:4000/v1/versions/KJV/books
```

---

## 🧹 Cleanup Commands

### Clean Node Modules
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Clean Build Files
```bash
# Backend
rm -rf dist

# Frontend
cd frontend
rm -rf dist
```

### Clean Docker
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

---

## 📝 Git Commands

### Basic Git
```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull
git pull origin main
```

### Branch Management
```bash
# Create branch
git checkout -b feature/your-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/your-feature
```

---

## 🔐 Security Commands

### Generate JWT Secret
```bash
# Generate random secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Check for Vulnerabilities
```bash
# Backend
npm audit

# Frontend
cd frontend && npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 📊 Monitoring Commands

### Check Process
```bash
# Windows
tasklist | findstr node

# Mac/Linux
ps aux | grep node
```

### Check Disk Usage
```bash
# Windows
dir

# Mac/Linux
du -sh *
```

### Check Docker Resources
```bash
docker stats
```

---

## 🚢 Deployment Commands

### Build for Production
```bash
# Backend
npm run build

# Frontend
cd frontend && npm run build
```

### Test Production Build
```bash
# Backend
npm start

# Frontend
cd frontend && npm run preview
```

---

## 💡 Quick Tips

### Run Multiple Commands
```bash
# Windows (PowerShell)
npm run dev; cd frontend; npm run dev

# Mac/Linux
npm run dev & cd frontend && npm run dev
```

### Watch Mode
```bash
# Backend sudah auto-reload dengan tsx watch
npm run dev

# Frontend auto-reload dengan Vite
cd frontend && npm run dev
```

### Environment-specific
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

---

## 📚 Related Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Panduan Lengkap](./PANDUAN_MENJALANKAN.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)

---

**Happy Coding! 🚀**

