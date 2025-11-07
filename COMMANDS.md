# 🛠️ Command Reference

Daftar lengkap command yang sering digunakan untuk development.

---

## 📦 Installation Commands

### Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### Clean Install (jika ada masalah)
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Running Services

### Backend

```bash
# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run with specific port
PORT=5000 npm run dev
```

### Frontend

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Start All Services

```bash
# Windows
start-all.bat

# Linux/Mac
chmod +x start-all.sh
./start-all.sh
```

---

## 🗄️ Database Commands

### Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Pull schema from database
npx prisma db pull

# Push schema to database (without migration)
npx prisma db push

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

### Seeding

```bash
# Seed sample data
npm run seed:sample

# Custom seed script
npx ts-node scripts/seed/seed.ts scripts/seed/sample.json
```

---

## 🐳 Docker Commands

### Start Services

```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d postgres
docker compose up -d redis
docker compose up -d meilisearch
docker compose up -d minio

# Start with logs
docker compose up
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (DANGER: deletes data)
docker compose down -v

# Stop specific service
docker compose stop postgres
```

### Check Status

```bash
# List running containers
docker compose ps

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Logs for specific service
docker compose logs postgres
docker compose logs -f backend
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart postgres
```

---

## 🧪 Testing & Debugging

### API Testing

```bash
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Bible versions (with auth)
curl http://localhost:4000/v1/bible/versions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check Ports

```bash
# Windows
netstat -ano | findstr :4000
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :4000
lsof -i :5173
```

### Kill Process on Port

```bash
# Windows
# Find PID first with netstat, then:
taskkill /PID <PID> /F

# Linux/Mac
kill -9 $(lsof -t -i:4000)
kill -9 $(lsof -t -i:5173)
```

---

## 🔍 Debugging Commands

### View Logs

```bash
# Backend logs (if using PM2)
pm2 logs

# Docker logs
docker compose logs -f backend
docker compose logs -f frontend

# System logs
tail -f /var/log/syslog  # Linux
```

### Database Debugging

```bash
# Connect to PostgreSQL
psql -U hb_user -d holybible -h localhost

# Inside psql:
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM "User" LIMIT 10;
```

### Redis Debugging

```bash
# Connect to Redis
redis-cli

# Inside redis-cli:
PING            # Test connection
KEYS *          # List all keys
GET key_name    # Get value
FLUSHALL        # Clear all data (DANGER)
```

---

## 🧹 Cleanup Commands

### Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules
rm -rf frontend/node_modules

# Clear build artifacts
rm -rf dist
rm -rf frontend/dist
rm -rf .next
```

### Reset Everything

```bash
# Stop all services
docker compose down -v

# Clear dependencies
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Clear build
rm -rf dist frontend/dist

# Reinstall
npm install
cd frontend && npm install
```

---

## 📊 Monitoring Commands

### System Resources

```bash
# Check Node.js processes
ps aux | grep node

# Check memory usage
free -h  # Linux
top      # Linux/Mac

# Check disk space
df -h
```

### Application Health

```bash
# Backend health
curl http://localhost:4000/health

# Check if ports are open
nc -zv localhost 4000
nc -zv localhost 5173
```

---

## 🔐 Security Commands

### Generate Secrets

```bash
# Generate random secret for JWT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate UUID
node -e "console.log(require('crypto').randomUUID())"
```

### Check Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 📝 Git Commands (Bonus)

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull latest
git pull

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# View logs
git log --oneline
```

---

## 🎯 Quick Commands Cheat Sheet

### Most Used Commands

```bash
# Start development
npm run dev                          # Backend
cd frontend && npm run dev           # Frontend

# Database
npx prisma generate                  # Generate client
npx prisma migrate dev              # Run migrations
npx prisma studio                   # Open GUI

# Docker
docker compose up -d                # Start services
docker compose down                 # Stop services
docker compose ps                   # Check status

# Testing
curl http://localhost:4000/health   # Health check
npm run lint                        # Lint code
npm run build                       # Build for production
```

---

## 💡 Tips

1. **Use aliases** untuk command yang sering dipakai:
   ```bash
   # Add to .bashrc or .zshrc
   alias dev-be="npm run dev"
   alias dev-fe="cd frontend && npm run dev"
   alias db-studio="npx prisma studio"
   ```

2. **Use tmux/screen** untuk multiple terminals:
   ```bash
   tmux new -s holy-bible
   # Split panes: Ctrl+B then %
   ```

3. **Use nodemon** untuk auto-restart:
   ```bash
   npm install -g nodemon
   nodemon src/index.ts
   ```

---

**Happy Coding! 🚀**
