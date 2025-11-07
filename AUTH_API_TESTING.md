# 🔐 API Authentication Testing Guide

## Endpoints yang Tersedia

### 1. **POST /auth/register** - Registrasi User Baru

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

#### Validasi:
- ✅ Email: Format valid, otomatis lowercase dan trim
- ✅ Password: 
  - Minimal 8 karakter
  - Maksimal 100 karakter
  - Harus ada minimal 1 huruf kapital
  - Harus ada minimal 1 huruf kecil
  - Harus ada minimal 1 angka
- ✅ Name: Minimal 2 karakter, maksimal 100 karakter
- ✅ Email duplicate check: Email tidak boleh sudah terdaftar

#### Response Sukses (201 Created)
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": {
    "id": "clxx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Response Error - Email Sudah Terdaftar (409 Conflict)
```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "errors": [
    {
      "field": "email",
      "message": "Email sudah digunakan"
    }
  ]
}
```

#### Response Error - Validasi Gagal (400 Bad Request)
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "password",
      "message": "Password harus mengandung minimal 1 huruf kapital"
    }
  ]
}
```

---

### 2. **POST /auth/login** - Login User

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Login berhasil",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Response Error - Kredensial Invalid (401 Unauthorized)
```json
{
  "success": false,
  "message": "Email atau password salah",
  "errors": [
    {
      "field": "credentials",
      "message": "Kredensial tidak valid"
    }
  ]
}
```

---

### 3. **GET /auth/me** - Get Current User (Requires Authentication)

#### Headers
```
Authorization: Bearer <accessToken>
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "clxx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Response Error - Token Invalid (401 Unauthorized)
```json
{
  "message": "Invalid token"
}
```

---

### 4. **POST /auth/refresh** - Refresh Access Token

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### Response Error - Session Invalid (401 Unauthorized)
```json
{
  "success": false,
  "message": "Session tidak valid atau sudah kadaluarsa"
}
```

---

### 5. **POST /auth/logout** - Logout (Requires Authentication)

#### Headers
```
Authorization: Bearer <accessToken>
```

#### Request Body (Optional)
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 🧪 Testing dengan cURL

### 1. Register User Baru
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Get Current User (gunakan accessToken dari login)
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token (gunakan refreshToken dari login)
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 5. Logout
```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 🧪 Testing dengan Postman/Insomnia

### Setup Environment Variables
```
base_url = http://localhost:4000
access_token = (akan diisi otomatis dari response login)
refresh_token = (akan diisi otomatis dari response login)
```

### Collection:

1. **Register**
   - Method: POST
   - URL: {{base_url}}/auth/register
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Test1234",
       "name": "Test User"
     }
     ```

2. **Login**
   - Method: POST
   - URL: {{base_url}}/auth/login
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Test1234"
     }
     ```
   - Tests (Save tokens):
     ```javascript
     const response = pm.response.json();
     pm.environment.set("access_token", response.accessToken);
     pm.environment.set("refresh_token", response.refreshToken);
     ```

3. **Get Me**
   - Method: GET
   - URL: {{base_url}}/auth/me
   - Headers:
     - Authorization: Bearer {{access_token}}

4. **Refresh Token**
   - Method: POST
   - URL: {{base_url}}/auth/refresh
   - Body (JSON):
     ```json
     {
       "refreshToken": "{{refresh_token}}"
     }
     ```

5. **Logout**
   - Method: POST
   - URL: {{base_url}}/auth/logout
   - Headers:
     - Authorization: Bearer {{access_token}}
   - Body (JSON):
     ```json
     {
       "refreshToken": "{{refresh_token}}"
     }
     ```

---

## ✅ Test Cases untuk Validasi

### Test Register:
1. ✅ Register dengan data valid → Sukses
2. ✅ Register dengan email yang sudah ada → Error 409
3. ✅ Register dengan password kurang dari 8 karakter → Error 400
4. ✅ Register dengan password tanpa huruf kapital → Error 400
5. ✅ Register dengan password tanpa huruf kecil → Error 400
6. ✅ Register dengan password tanpa angka → Error 400
7. ✅ Register dengan email format invalid → Error 400
8. ✅ Register dengan nama kurang dari 2 karakter → Error 400

### Test Login:
1. ✅ Login dengan kredensial valid → Sukses, dapat token
2. ✅ Login dengan email salah → Error 401
3. ✅ Login dengan password salah → Error 401
4. ✅ Login dengan email belum terdaftar → Error 401

### Test Get Me:
1. ✅ Request dengan token valid → Sukses
2. ✅ Request tanpa token → Error 401
3. ✅ Request dengan token invalid → Error 401

### Test Refresh:
1. ✅ Refresh dengan token valid → Sukses, dapat access token baru
2. ✅ Refresh dengan token invalid → Error 401
3. ✅ Refresh dengan token expired → Error 401

### Test Logout:
1. ✅ Logout dengan token valid → Sukses
2. ✅ Logout tanpa token → Error 401

---

## 🔐 Fitur Keamanan yang Diimplementasikan

1. **Password Hashing dengan Bcrypt**
   - Salt rounds: 10
   - Secure hashing algorithm

2. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Name length validation
   - Automatic email lowercase & trim

3. **Duplicate User Prevention**
   - Check email existence before registration
   - Unique constraint on email field

4. **JWT Token Management**
   - Access Token: Expires in 1 hour (configurable)
   - Refresh Token: Expires in 30 days (configurable)
   - Token verification on protected endpoints

5. **Session Management**
   - Database-backed sessions
   - Session expiration check
   - Auto-cleanup of expired sessions

6. **Error Handling**
   - Consistent error response format
   - Detailed validation errors
   - No sensitive data in error messages

7. **CORS Protection**
   - Configured in server setup
   - Credentials support enabled

---

## 📝 Environment Variables

Pastikan `.env` file memiliki konfigurasi berikut:

```env
# Database
DATABASE_URL=file:./dev.db

# JWT Configuration
JWT_PRIVATE_KEY=dev_secret_change_me_in_production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES=30d

# Server
PORT=4000
NODE_ENV=development
```

---

## 🚀 Menjalankan Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server akan berjalan di: **http://localhost:4000**

API Documentation (Swagger): **http://localhost:4000/docs**

---

## 🐛 Troubleshooting

### Error: "Email sudah terdaftar"
- Pastikan email belum pernah digunakan
- Cek database: `npx prisma studio`

### Error: "Invalid token"
- Token mungkin sudah expired
- Gunakan refresh token untuk mendapatkan token baru
- Jika refresh token juga expired, login ulang

### Error: "Session tidak valid"
- Session mungkin sudah dihapus atau expired
- Login ulang untuk membuat session baru

### Server tidak jalan
- Cek apakah PostgreSQL/SQLite sudah running
- Cek environment variables di `.env`
- Cek log error di console

---

**Happy Testing! 🎉**
