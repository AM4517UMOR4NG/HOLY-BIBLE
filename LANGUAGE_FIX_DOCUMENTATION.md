# 🌐 Language Switching Fix - Dokumentasi Lengkap

## 🎯 Masalah yang Diperbaiki

### Masalah Utama
Ketika aplikasi di-deploy ke Vercel, language switching tidak berfungsi dengan baik, khususnya untuk bahasa Indonesia. Ini disebabkan oleh:

1. **SSR (Server-Side Rendering) Issue**: Kode mencoba mengakses `localStorage` pada saat build/server-side, padahal `localStorage` hanya tersedia di browser (client-side)
2. **Fallback Language**: Default fallback adalah English, bukan Indonesian

### Error yang Terjadi
```
ReferenceError: localStorage is not defined
```

## ✅ Solusi yang Diterapkan

### 1. Fix i18n Configuration (`src/i18n/config.ts`)

**Sebelum:**
```typescript
const savedLanguage = localStorage.getItem('language') || 'en'
```

**Sesudah:**
```typescript
const getSavedLanguage = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem('language') || 'id'
    } catch (e) {
      console.warn('localStorage not accessible:', e)
      return 'id'
    }
  }
  // Default to Indonesian on server-side
  return 'id'
}
```

**Perubahan Penting:**
- ✅ Safe check untuk `window` dan `localStorage`
- ✅ Try-catch untuk error handling
- ✅ Default ke bahasa Indonesia ('id')
- ✅ Added `react.useSuspense: false` untuk better SSR support

### 2. Update LanguageContext (`src/contexts/LanguageContext.tsx`)

**Perubahan:**
- ✅ Lazy initialization dengan function untuk `useState`
- ✅ Safe localStorage access di semua fungsi
- ✅ Added useEffect untuk sync localStorage on mount
- ✅ Bahasa Indonesia diprioritaskan sebagai default

**Urutan Bahasa:**
1. 🇮🇩 Indonesia (Default & Priority)
2. 🇬🇧 English
3. 🇪🇸 Spanish (Español)
4. 🇵🇹 Portuguese (Português)
5. 🇨🇳 Chinese (中文)
6. 🇰🇷 Korean (한국어)

### 3. Tambahan Bahasa Baru

Created complete translation files:
- ✅ `locales/es.json` - Spanish
- ✅ `locales/pt.json` - Portuguese
- ✅ `locales/zh.json` - Chinese
- ✅ `locales/ko.json` - Korean

## 🧪 Cara Testing

### Test Lokal (Development)

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run dev server:**
```bash
npm run dev
```

3. **Test language switching:**
   - Buka aplikasi di browser
   - Klik icon Globe (🌐) di header
   - Pilih bahasa Indonesia
   - Verify bahwa teks berubah ke bahasa Indonesia
   - Refresh halaman - bahasa harus tetap Indonesia
   - Coba switch ke bahasa lain dan kembali ke Indonesia

### Test Production Build

1. **Build aplikasi:**
```bash
cd frontend
npm run build
```

2. **Preview production build:**
```bash
npm run preview
```

3. **Test sama seperti dev mode**

### Test di Vercel

1. **Push ke repository:**
```bash
git add .
git commit -m "Fix: Language switching untuk Vercel SSR support"
git push
```

2. **Deploy ke Vercel:**
   - Vercel akan auto-deploy jika sudah di-setup
   - Atau manual deploy melalui Vercel dashboard

3. **Verify di production:**
   - Buka URL Vercel
   - Test language switching
   - Check console browser untuk memastikan tidak ada error
   - Test di multiple pages (Read, Search, Bookmarks)

## 🔍 Debugging

### Cek di Browser Console

1. **Check current language:**
```javascript
localStorage.getItem('language')
```

2. **Manually set language:**
```javascript
localStorage.setItem('language', 'id')
window.location.reload()
```

3. **Clear language cache:**
```javascript
localStorage.removeItem('language')
window.location.reload()
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Language tidak berubah | localStorage blocked | Check browser privacy settings |
| Error di console | Old build cached | Clear browser cache & hard refresh (Ctrl+Shift+R) |
| Indonesian tidak muncul | Translation missing | Verify `id.json` exists di `locales/` |
| Vercel build fails | Dependencies issue | Run `npm ci` di frontend folder |

## 📝 Technical Details

### Files Modified:
1. ✅ `frontend/src/i18n/config.ts`
2. ✅ `frontend/src/contexts/LanguageContext.tsx`

### Files Created:
1. ✅ `frontend/src/locales/es.json`
2. ✅ `frontend/src/locales/pt.json`
3. ✅ `frontend/src/locales/zh.json`
4. ✅ `frontend/src/locales/ko.json`

### Key Changes Summary:
- SSR-safe localStorage access
- Indonesian as default language
- 6 languages total (was 2, now 6)
- Better error handling
- Client-side hydration support

## 🚀 Deployment Checklist

- [x] Code changes implemented
- [x] Build successful locally
- [x] All translation files created
- [x] LanguageContext updated
- [x] i18n config updated for SSR
- [x] Ready for Vercel deployment

## 📞 Support

Jika masih ada masalah:
1. Check browser console untuk error messages
2. Verify vercel.json configuration
3. Check Vercel deployment logs
4. Test di incognito/private browser window

## 🎉 Expected Result

Setelah fix ini:
- ✅ Language switching bekerja dengan sempurna di Vercel
- ✅ Bahasa Indonesia sebagai default
- ✅ Tidak ada error localStorage di server-side
- ✅ 6 bahasa tersedia untuk user
- ✅ Language preference tersimpan di localStorage
- ✅ Smooth switching tanpa page reload
