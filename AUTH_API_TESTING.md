# 📖 Authentication API Testing Guide

Comprehensive testing documentation untuk authentication endpoints.

## 🧪 Testing Tools

### Recommended Tools
- **cURL** - Command line testing
- **Postman** - GUI testing
- **Insomnia** - Alternative GUI
- **HTTPie** - User-friendly CLI
- **Browser DevTools** - Network tab

---

## 📋 Test Scenarios

### 1. Register User

#### ✅ Success Case
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Expected Response:**
- Status: `201 Created`
- Body contains: `success: true`, `user` object

#### ❌ Validation Errors

**Invalid Email:**
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Weak Password:**
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "weak",
    "name": "Test User"
  }'
```

**Short Name:**
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "A"
  }'
```

#### ❌ Duplicate Email
```bash
# Register first time (success)
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "Test1234",
    "name": "First User"
  }'

# Try to register again (should fail)
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "Test1234",
    "name": "Second User"
  }'
```

**Expected Response:**
- Status: `409 Conflict`
- Message: "Email sudah terdaftar"

---

### 2. Login

#### ✅ Success Case
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected Response:**
- Status: `200 OK`
- Body contains: `accessToken`, `refreshToken`, `user`

**Save tokens for next tests:**
```bash
# Save response to variable (bash)
RESPONSE=$(curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }')

# Extract tokens (requires jq)
ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $RESPONSE | jq -r '.refreshToken')
```

#### ❌ Invalid Credentials

**Wrong Email:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "Test1234"
  }'
```

**Wrong Password:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response:**
- Status: `401 Unauthorized`
- Message: "Email atau password salah"

---

### 3. Get Current User

#### ✅ Success Case
```bash
curl -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response:**
- Status: `200 OK`
- Body contains: `user` object with user details

#### ❌ Invalid Token

**No Token:**
```bash
curl -X GET http://localhost:4000/v1/auth/me
```

**Invalid Token:**
```bash
curl -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expired Token:**
```bash
# Use an expired token
curl -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer expired_token_here"
```

**Expected Response:**
- Status: `401 Unauthorized`

---

### 4. Refresh Token

#### ✅ Success Case
```bash
curl -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

**Expected Response:**
- Status: `200 OK`
- Body contains: new `accessToken` and `user`

#### ❌ Invalid Refresh Token

**No Token:**
```bash
curl -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Invalid Token:**
```bash
curl -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid_token"
  }'
```

**Expired Token:**
```bash
# Use an expired refresh token
curl -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "expired_refresh_token"
  }'
```

**Expected Response:**
- Status: `401 Unauthorized`
- Message: "Session tidak valid atau sudah kadaluarsa"

---

### 5. Logout

#### ✅ Success Case
```bash
curl -X POST http://localhost:4000/v1/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

**Expected Response:**
- Status: `200 OK`
- Message: "Logout berhasil"

#### ❌ Without Token
```bash
curl -X POST http://localhost:4000/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "some_token"
  }'
```

**Expected Response:**
- Status: `401 Unauthorized`

---

## 🔄 Complete Flow Test

### Full Authentication Flow
```bash
#!/bin/bash

# 1. Register
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "flowtest@example.com",
    "password": "Test1234",
    "name": "Flow Test User"
  }')
echo "Register: $REGISTER_RESPONSE"

# 2. Login
echo -e "\n2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "flowtest@example.com",
    "password": "Test1234"
  }')
echo "Login: $LOGIN_RESPONSE"

# Extract tokens
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')

# 3. Get Current User
echo -e "\n3. Getting current user..."
ME_RESPONSE=$(curl -s -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "Me: $ME_RESPONSE"

# 4. Refresh Token
echo -e "\n4. Refreshing token..."
REFRESH_RESPONSE=$(curl -s -X POST http://localhost:4000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")
echo "Refresh: $REFRESH_RESPONSE"

# Extract new access token
NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')

# 5. Use New Token
echo -e "\n5. Using new token..."
NEW_ME_RESPONSE=$(curl -s -X GET http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")
echo "New Me: $NEW_ME_RESPONSE"

# 6. Logout
echo -e "\n6. Logging out..."
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:4000/v1/auth/logout \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")
echo "Logout: $LOGOUT_RESPONSE"

echo -e "\n✅ Flow test complete!"
```

---

## 🧪 Automated Testing

### Using Node.js Script

```javascript
// test-auth-flow.js
import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000/v1/auth';

async function testAuthFlow() {
  try {
    // 1. Register
    const registerRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'autotest@example.com',
        password: 'Test1234',
        name: 'Auto Test User'
      })
    });
    const registerData = await registerRes.json();
    console.log('Register:', registerData);

    // 2. Login
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'autotest@example.com',
        password: 'Test1234'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginData);

    const { accessToken, refreshToken } = loginData;

    // 3. Get Me
    const meRes = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const meData = await meRes.json();
    console.log('Me:', meData);

    // 4. Refresh
    const refreshRes = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const refreshData = await refreshRes.json();
    console.log('Refresh:', refreshData);

    // 5. Logout
    const logoutRes = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    const logoutData = await logoutRes.json();
    console.log('Logout:', logoutData);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthFlow();
```

---

## 📊 Test Checklist

- [ ] Register with valid data
- [ ] Register with invalid email
- [ ] Register with weak password
- [ ] Register with duplicate email
- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with wrong password
- [ ] Get current user with valid token
- [ ] Get current user without token
- [ ] Get current user with invalid token
- [ ] Refresh token with valid refresh token
- [ ] Refresh token with invalid refresh token
- [ ] Refresh token with expired refresh token
- [ ] Logout with valid token
- [ ] Logout without token
- [ ] Complete authentication flow

---

## 🔗 Related Documentation

- [Quick Reference](./AUTH_QUICK_REFERENCE.md) - Quick API reference
- [Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md) - Implementation details

---

**Happy Testing! 🧪**

