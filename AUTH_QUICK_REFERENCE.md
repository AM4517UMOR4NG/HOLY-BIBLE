# Authentication Quick Reference

Quick API reference untuk authentication endpoints di HOLY BIBLE.

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/v1/auth/register` | No | Register user baru |
| POST | `/v1/auth/login` | No | Login user |
| POST | `/v1/auth/refresh` | No | Refresh access token |
| POST | `/v1/auth/logout` | Yes | Logout user |
| GET | `/v1/auth/me` | Yes | Get current user |

---

## Register

**Endpoint:** `POST /v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "User Name"
}
```

**Password Requirements:**
- Minimal 8 karakter
- Maksimal 100 karakter
- Harus mengandung minimal 1 huruf kapital
- Harus mengandung minimal 1 huruf kecil
- Harus mengandung minimal 1 angka

**Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (409):**
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

**cURL Example:**
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "User Name"
  }'
```

---

## Login

**Endpoint:** `POST /v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (401):**
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

**cURL Example:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

---

## Refresh Token

**Endpoint:** `POST /v1/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Session tidak valid atau sudah kadaluarsa"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

## Get Current User

**Endpoint:** `GET /v1/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer your_access_token_here"
```

---

## Logout

**Endpoint:** `POST /v1/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (Optional):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/v1/auth/logout \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

## Token Details

### Access Token
- **Type:** JWT
- **Expiration:** 1 hour (3600 seconds)
- **Contains:** User ID (`sub`), Role
- **Usage:** Include in `Authorization: Bearer <token>` header

### Refresh Token
- **Type:** JWT
- **Expiration:** 30 days
- **Contains:** User ID (`sub`), Session ID
- **Usage:** Send in request body to `/v1/auth/refresh`

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (Register) |
| 400 | Bad Request (Validation error) |
| 401 | Unauthorized (Invalid credentials/token) |
| 409 | Conflict (Email already exists) |
| 500 | Internal Server Error |

---

## Best Practices

1. **Store Tokens Securely**
   - Store in httpOnly cookies (recommended)
   - Or in secure storage (localStorage/sessionStorage)
   - Never expose tokens in URLs

2. **Token Refresh**
   - Refresh access token before expiration
   - Handle token refresh errors gracefully
   - Redirect to login if refresh fails

3. **Error Handling**
   - Check `success` field in response
   - Handle validation errors from `errors` array
   - Show user-friendly error messages

4. **Security**
   - Always use HTTPS in production
   - Never log tokens
   - Implement token rotation if needed

---

## Related Documentation

- [API Testing Guide](./AUTH_API_TESTING.md) - Comprehensive testing
- [Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md) - Implementation details

---
