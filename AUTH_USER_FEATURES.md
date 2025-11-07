# 🎯 User Authentication & Features Documentation

## ✅ Fitur yang Sudah Diimplementasikan

### 1. **Authentication System** 🔐
- ✅ User Registration dengan validasi ketat
- ✅ User Login dengan bcrypt password hashing
- ✅ JWT Token Management (Access + Refresh)
- ✅ Session Management di database
- ✅ Auto-redirect setelah login
- ✅ Persistent login (token stored in localStorage)

### 2. **Dynamic Navbar** 🧭
- ✅ **Guest (Belum Login):**
  - Tombol "Login" muncul di navbar
  - Hanya menu "Read" dan "Search" yang tersedia
  - Bookmarks menu disembunyikan

- ✅ **User (Sudah Login):**
  - Tombol "Login" berubah jadi **User Menu** dengan nama/email
  - User dropdown menu dengan:
    - Info user (nama, email, role)
    - Tombol **"Logout"**
  - Bookmarks menu **muncul** dan bisa diakses

### 3. **Mobile Menu** 📱
- ✅ **Guest Mode:**
  - Menu Read & Search tersedia
  - Bookmarks di-disable dengan pesan "Login to access Bookmarks"
  - Tombol Login di bawah

- ✅ **User Mode:**
  - User info card di atas (foto profile, nama, email, role)
  - Semua menu tersedia (Read, Search, Bookmarks)
  - Tombol **Logout** (merah) di bawah

---

## 🆚 Perbedaan Guest vs User

### 📖 Guest (Tidak Login)
```
✅ Bisa membaca Alkitab (Read)
✅ Bisa mencari ayat (Search)
❌ TIDAK bisa akses Bookmarks
❌ TIDAK bisa buat Annotations
❌ TIDAK bisa save favorites
```

### 👤 User (Sudah Login)
```
✅ Bisa membaca Alkitab (Read)
✅ Bisa mencari ayat (Search)
✅ Bisa akses Bookmarks
✅ Bisa buat Annotations (coming soon)
✅ Bisa save favorites
✅ Data tersimpan per user
```

---

## 🎨 UI/UX Features

### Desktop View

#### Guest (Belum Login)
```
┌─────────────────────────────────────────────────────┐
│  📖 Holy Bible    Read  Search         🌓  [Login]  │
└─────────────────────────────────────────────────────┘
```

#### User (Sudah Login)
```
┌─────────────────────────────────────────────────────────┐
│  📖 Holy Bible    Read  Search  📑Bookmarks   🌓  [👤 John]  │
│                                                  │
│  (Click "👤 John" untuk show dropdown:)          │
│  ┌──────────────────────┐                       │
│  │ John Doe             │                       │
│  │ john@example.com     │                       │
│  │ [USER]               │                       │
│  ├──────────────────────┤                       │
│  │ 🚪 Logout             │                       │
│  └──────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Mobile View

#### Guest Menu
```
┌────────────────────────────┐
│ 📖 Read                     │
│ 🔍 Search                   │
│ 🔖 Login to access Bookmarks│ (disabled)
├────────────────────────────┤
│ 🌓 Light Mode              │
│ 🔐 Login                    │ (blue button)
└────────────────────────────┘
```

#### User Menu
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ 👤  John Doe           │ │
│ │     john@example.com   │ │
│ │     [USER]             │ │
│ └────────────────────────┘ │
├────────────────────────────┤
│ 📖 Read                     │
│ 🔍 Search                   │
│ 🔖 Bookmarks                │ (enabled)
├────────────────────────────┤
│ 🌓 Light Mode              │
│ 🚪 Logout                   │ (red button)
└────────────────────────────┘
```

---

## 🔄 User Flow

### 1. Guest Flow (Pertama Kali)
```
Open App
  ↓
Lihat halaman Read (bisa baca Alkitab)
  ↓
Lihat navbar: Read, Search, [Login]
  ↓
Coba akses Bookmarks → Tidak ada menu
  ↓
Klik "Login"
  ↓
Halaman Login/Register
```

### 2. Registration Flow
```
Klik "Login" di navbar
  ↓
Klik "Sign up"
  ↓
Isi form:
  - Name
  - Email
  - Password (min 8 chars, A-Z, a-z, 0-9)
  - Confirm Password
  - ✓ Agree to terms
  ↓
Klik "Get Started"
  ↓
Validasi di frontend
  ↓
POST /auth/register ke backend
  ↓
Validasi di backend (email unique, password strength)
  ↓
Hash password dengan bcrypt
  ↓
Simpan ke database
  ↓
Success message muncul
  ↓
Auto switch ke login form (2 detik)
```

### 3. Login Flow
```
Isi email & password
  ↓
Klik "Sign In"
  ↓
POST /auth/login ke backend
  ↓
Backend verify password (bcrypt)
  ↓
Generate JWT tokens:
  - Access Token (1 hour)
  - Refresh Token (30 days)
  ↓
Buat session di database
  ↓
Return tokens + user data
  ↓
Frontend store tokens di localStorage
  ↓
Update auth context (set user)
  ↓
Success message muncul
  ↓
Auto redirect ke home (1 detik)
  ↓
Navbar berubah: [Login] → [👤 User Name]
  ↓
Bookmarks menu muncul!
```

### 4. Authenticated User Flow
```
User sudah login
  ↓
Refresh page → Token di localStorage
  ↓
App load → Auth Context check token
  ↓
GET /auth/me (verify token)
  ↓
Token valid → Set user di context
  ↓
Navbar show user name & logout
  ↓
Bookmarks menu available
  ↓
User bisa akses semua fitur
```

### 5. Logout Flow
```
User klik nama di navbar
  ↓
Dropdown menu muncul
  ↓
Klik "Logout"
  ↓
POST /auth/logout ke backend
  ↓
Delete session dari database
  ↓
Clear localStorage (tokens)
  ↓
Clear auth context (user = null)
  ↓
Navbar berubah: [👤 User] → [Login]
  ↓
Bookmarks menu hilang
  ↓
Auto redirect ke home
```

---

## 🧪 Testing Guide

### Test 1: Guest Mode
1. ✅ Open app tanpa login
2. ✅ Cek navbar: hanya "Read", "Search", "Login"
3. ✅ Bisa baca Alkitab
4. ✅ Bisa search ayat
5. ❌ Tidak ada menu Bookmarks

### Test 2: Register & Login
1. ✅ Klik "Login" → Halaman auth
2. ✅ Klik "Sign up"
3. ✅ Isi form dengan password kuat (Password123)
4. ✅ Klik "Get Started"
5. ✅ Muncul success message
6. ✅ Auto switch ke login form
7. ✅ Login dengan kredensial tadi
8. ✅ Muncul success message
9. ✅ Auto redirect ke home
10. ✅ Navbar berubah: show user name

### Test 3: User Menu
1. ✅ Klik user name di navbar (desktop)
2. ✅ Dropdown muncul dengan:
   - Nama user
   - Email
   - Role badge
   - Tombol Logout
3. ✅ Klik "Logout"
4. ✅ Navbar berubah kembali ke "Login"
5. ✅ Bookmarks menu hilang

### Test 4: Mobile Menu
1. ✅ Buka di mobile (atau resize browser)
2. ✅ Klik hamburger menu
3. ✅ Guest: Bookmarks disabled dengan pesan
4. ✅ Login
5. ✅ Klik hamburger lagi
6. ✅ User info card muncul di atas
7. ✅ Bookmarks enabled
8. ✅ Tombol Logout (merah) di bawah

### Test 5: Persistent Login
1. ✅ Login
2. ✅ Refresh page (F5)
3. ✅ User masih login (navbar tetap show user)
4. ✅ Bookmarks masih tersedia

### Test 6: Token Expiry
1. ✅ Login
2. ⏰ Tunggu 1 jam (atau ubah JWT_EXPIRES_IN jadi 1 minute untuk test)
3. ✅ Access token expired
4. ✅ User logout otomatis
5. ✅ Redirect ke home dengan navbar "Login"

---

## 🔐 Security Features

1. **Password Security**
   - ✅ Bcrypt hashing (salt rounds: 10)
   - ✅ No plain text storage
   - ✅ Strong password requirements

2. **Token Security**
   - ✅ JWT signed with secret key
   - ✅ Access token expires in 1 hour
   - ✅ Refresh token expires in 30 days
   - ✅ Token verification on protected routes

3. **Session Security**
   - ✅ Database-backed sessions
   - ✅ Session cleanup on logout
   - ✅ Expired session detection

4. **Frontend Security**
   - ✅ Tokens in localStorage (consider httpOnly cookies for production)
   - ✅ Auto token refresh (refresh token mechanism ready)
   - ✅ Protected features for authenticated users only

---

## 📊 Auth State Management

### Auth Context Structure
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: string  // "USER" | "EDITOR" | "ADMIN"
  } | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (email, password) => Promise<{success, error?}>,
  logout: () => void,
  checkAuth: () => Promise<void>
}
```

### Usage in Components
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## 🎯 Future Enhancements

### Planned Features
- [ ] **Annotations** - User bisa add notes ke ayat
- [ ] **Reading History** - Track ayat yang pernah dibaca
- [ ] **Reading Plans** - Custom reading schedules
- [ ] **Favorites Collections** - Organize bookmarks in collections
- [ ] **Sharing** - Share ayat ke social media
- [ ] **Dark/Light Mode per User** - Save preference
- [ ] **Profile Settings** - Edit nama, email, password
- [ ] **Email Verification** - Verify email saat register
- [ ] **Password Reset** - Forgot password feature
- [ ] **Social Login** - Google, Facebook OAuth

### Backend Enhancements
- [ ] Rate limiting for login attempts
- [ ] Account lockout after failed attempts
- [ ] Two-factor authentication (2FA)
- [ ] Session management dashboard
- [ ] User activity logs

---

## 📝 Summary

✅ **Authentication:** Complete & tested
✅ **Dynamic Navbar:** Shows Login/Logout based on auth state
✅ **User Menu:** Dropdown with user info & logout
✅ **Protected Features:** Bookmarks hanya untuk logged-in users
✅ **Guest Mode:** Bisa baca Alkitab & search, tidak bisa bookmarks
✅ **User Mode:** Akses penuh ke semua fitur
✅ **Mobile Responsive:** Semua fitur work di mobile
✅ **Persistent Login:** Token saved, user stay logged in after refresh
✅ **Secure:** Bcrypt, JWT, Session management

**Status: Production Ready! 🎉**

---

**Last Updated:** November 6, 2024
