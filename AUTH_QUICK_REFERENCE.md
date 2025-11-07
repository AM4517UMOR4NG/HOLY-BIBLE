# 🚀 Auth API - Quick Reference

## Base URL
```
http://localhost:4000
```

## 📝 Quick Examples

### Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### Logout
```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

## 🔑 Password Requirements

✅ Minimal **8 karakter**  
✅ Harus ada **huruf KAPITAL**  
✅ Harus ada **huruf kecil**  
✅ Harus ada **angka**

**Contoh Valid:**
- `Password123`
- `SecurePass1`
- `MyPass2024`

**Contoh Invalid:**
- `password` ❌ (tidak ada kapital & angka)
- `PASSWORD` ❌ (tidak ada huruf kecil & angka)
- `Pass123` ❌ (kurang dari 8 karakter)

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created (Register success) |
| 400 | ❌ Validation error |
| 401 | ❌ Unauthorized (bad credentials/token) |
| 409 | ❌ Conflict (email already exists) |
| 500 | ❌ Server error |

---

## 🎯 JavaScript/TypeScript Example

```javascript
// Register
const registerUser = async (email, password, name) => {
  const response = await fetch('http://localhost:4000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return response.json();
};

// Login
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  if (data.success) {
    // Simpan tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  
  return data;
};

// Get Current User
const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:4000/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Refresh Token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:4000/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
  }
  
  return data;
};

// Logout
const logout = async () => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  await fetch('http://localhost:4000/auth/logout', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
```

---

## 🛡️ Security Best Practices

1. **Simpan tokens dengan aman**
   - Gunakan `httpOnly` cookies (production)
   - Atau `localStorage` untuk development
   - Jangan simpan di sessionStorage jika butuh persistence

2. **Handle token expiry**
   - Access token expires dalam 1 jam
   - Gunakan refresh token untuk mendapatkan token baru
   - Implement automatic refresh sebelum token expired

3. **Logout saat user close app**
   - Kirim request ke `/auth/logout`
   - Hapus tokens dari storage
   - Clear user session

4. **Protect routes**
   - Cek token validity sebelum akses protected routes
   - Redirect ke login jika token invalid/expired

---

## ⚡ Testing

### Quick Test
```bash
node test-auth.js
```

### Manual Test with Browser Console
```javascript
// Open http://localhost:4000 in browser, then run in console:

// 1. Register
fetch('http://localhost:4000/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test1234',
    name: 'Test User'
  })
}).then(r => r.json()).then(console.log);

// 2. Login
fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test1234'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📖 Full Documentation

- **Complete API Guide**: `AUTH_API_TESTING.md`
- **Implementation Details**: `AUTH_IMPLEMENTATION_SUMMARY.md`
- **General Setup**: `PANDUAN_MENJALANKAN.md`

---

## 🔥 Common Issues

### "Email sudah terdaftar"
→ Email sudah digunakan, gunakan email lain

### "Invalid token"
→ Token expired atau invalid, refresh atau login ulang

### "Password minimal 8 karakter"
→ Password terlalu pendek, minimal 8 karakter

### "Password harus mengandung minimal 1 huruf kapital"
→ Tambahkan huruf kapital (A-Z)

### "Password harus mengandung minimal 1 angka"
→ Tambahkan angka (0-9)

### "Session tidak valid"
→ Session expired atau dihapus, login ulang

---

**Happy Coding! 🎉**
