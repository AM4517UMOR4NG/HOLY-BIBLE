# Authentication Implementation Summary

Fitur dan detail implementasi sistem authentication di HOLY BIBLE.

## Overview

Sistem authentication menggunakan **JWT (JSON Web Tokens)** dengan**refresh token pattern** untuk keamanan yang lebih baik. Implementasi mencakup:

- User registration dengan validasi
- Secure password hashing (bcrypt)
- JWT-based authentication
- Refresh token mechanism
- Session management
- Role-based access control

---

## Architecture

### Components

```
┌─────────────────────────────────────────┐
│         Authentication Flow             │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼───┐ ┌─────▼────┐ ┌───▼──────┐
│  Routes   │ │  Auth    │ │  Schema  │
│ (auth.ts) │ │ (auth.js)│ │(index.ts)│
└───────┬───┘ └─────┬────┘ └───┬──────┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼───────────┐
        │    Prisma (Database)  │
        └───────────────────────┘
```

### File Structure

```
src/
├── routes/
│   └── auth.ts              # Auth endpoints
├── lib/
│   └── auth.ts              # Auth utilities (JWT, bcrypt)
├── schemas/
│   └── index.ts             # Zod validation schemas
└── plugins/
    └── auth.ts              # Fastify auth plugin
```

---

## Features

### 1. User Registration

**Endpoint:** `POST /v1/auth/register`

**Features:**
- Email validation (format & uniqueness)
- Password strength validation
- Name validation
- Automatic password hashing (bcrypt)
- Default role assignment (USER)

**Password Requirements:**
- Minimum 8 characters
- Maximum 100 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

**Implementation:**
```typescript
// Hash password dengan bcrypt
const hashedPassword = await hashPassword(body.password);

// Create user
const user = await prisma.user.create({
  data: {
    email: body.email,
    name: body.name,
    hashedPassword,
    role: 'USER'
  }
});
```

---

### 2. User Login

**Endpoint:** `POST /v1/auth/login`

**Features:**
- Email & password validation
- Secure password verification (bcrypt)
- JWT token generation
- Refresh token generation
- Session creation in database
- Token expiration management

**Token Types:**
- **Access Token:** Short-lived (1 hour), for API requests
- **Refresh Token:** Long-lived (30 days), for token refresh

**Implementation:**
```typescript
// Verify password
const isPasswordValid = await verifyPassword(
  body.password, 
  user.hashedPassword
);

// Create session
const session = await prisma.session.create({
  data: {
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
});

// Generate tokens
const accessToken = signAccessToken({ sub: user.id, role: user.role });
const refreshToken = signRefreshToken({ 
  sub: user.id, 
  sessionId: session.id 
});
```

---

### 3. Token Refresh

**Endpoint:** `POST /v1/auth/refresh`

**Features:**
- Refresh token validation
- Session verification
- New access token generation
- Automatic session expiration check

**Flow:**
1. Client sends refresh token
2. Server verifies refresh token
3. Server checks session in database
4. Server validates session expiration
5. Server generates new access token
6. Server returns new access token

**Implementation:**
```typescript
// Verify refresh token
const payload = verifyRefreshToken(body.refreshToken);

// Check session
const session = await prisma.session.findUnique({
  where: { id: payload.sessionId, token: body.refreshToken }
});

// Check expiration
if (session.expiresAt < new Date()) {
  await prisma.session.delete({ where: { id: session.id } });
  throw new Error('Session expired');
}

// Generate new access token
const accessToken = signAccessToken({ 
  sub: session.user.id, 
  role: session.user.role 
});
```

---

### 4. Get Current User

**Endpoint:** `GET /v1/auth/me`

**Features:**
- JWT token validation
- User data retrieval
- Protected route (requires authentication)

**Implementation:**
```typescript
// Protected with preHandler
app.get('/auth/me', { preHandler: [app.authenticate] }, async (req, reply) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id }
  });
  return { success: true, user };
});
```

---

### 5. Logout

**Endpoint:** `POST /v1/auth/logout`

**Features:**
- Session deletion
- Token invalidation
- Optional refresh token cleanup

**Implementation:**
```typescript
if (body.refreshToken) {
  await prisma.session.deleteMany({
    where: {
      userId: req.user!.id,
      token: body.refreshToken
    }
  });
}
```

---

## Security Features

### 1. Password Hashing

**Algorithm:** bcrypt
**Rounds:** 10 (default)

```typescript
// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. JWT Tokens

**Algorithm:** HS256 (HMAC SHA-256)
**Secret:** Configurable via `JWT_PRIVATE_KEY`

**Access Token Payload:**
```json
{
  "sub": "user_id",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Refresh Token Payload:**
```json
{
  "sub": "user_id",
  "sessionId": "session_id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1237151490
}
```

### 3. Session Management

- Sessions stored in database
- Automatic expiration check
- Session cleanup on logout
- Refresh token linked to session

### 4. Input Validation

**Library:** Zod

**Validation Rules:**
- Email: Valid email format, lowercase, trimmed
- Password: Strength requirements enforced
- Name: Length validation (2-100 characters)

---

## Database Schema

### User Model
```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  hashedPassword String?
  name           String?
  role           String    @default("USER")
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  sessions       Session[]
}
```

### Session Model
```prisma
model Session {
  id        String   @id @default(cuid())
  userId   String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Configuration

### Environment Variables

```env
# JWT Configuration
JWT_PRIVATE_KEY=your_secret_key_here
JWT_EXPIRES_IN=3600              # 1 hour in seconds
REFRESH_TOKEN_EXPIRES=30d         # 30 days
```

### Token Expiration

- **Access Token:** 1 hour (3600 seconds)
- **Refresh Token:** 30 days

---

## Authentication Flow

```
1. User Registration
   └─> Hash Password
   └─> Create User
   └─> Return User Data

2. User Login
   └─> Verify Password
   └─> Create Session
   └─> Generate Tokens
   └─> Return Tokens + User

3. API Request
   └─> Include Access Token in Header
   └─> Server Validates Token
   └─> Process Request

4. Token Refresh
   └─> Send Refresh Token
   └─> Verify Session
   └─> Generate New Access Token
   └─> Return New Token

5. Logout
   └─> Delete Session
   └─> Invalidate Tokens
```

---

## Role-Based Access Control

**Roles:**
- `USER` - Default role, basic access
- `EDITOR` - Can edit content
- `ADMIN` - Full access, can import Bible versions

**Usage:**
```typescript
// Check role in route handler
if (req.user!.role !== 'ADMIN') {
  return reply.code(403).send({ message: 'Forbidden' });
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email sudah digunakan"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created (Register)
- `400` - Bad Request (Validation)
- `401` - Unauthorized (Invalid credentials/token)
- `409` - Conflict (Duplicate email)
- `500` - Internal Server Error

---

## Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook)
- [ ] Rate limiting
- [ ] Token rotation
- [ ] Device management
- [ ] Activity logging

---

## Related Documentation

- [Quick Reference](./AUTH_QUICK_REFERENCE.md) - Quick API reference
- [API Testing Guide](./AUTH_API_TESTING.md) - Testing documentation

---

## Technologies Used

- **JWT:** jsonwebtoken
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Database:** Prisma ORM
- **Framework:** Fastify

---

**Happy Coding!**

