import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../locales/en.json'
import idTranslation from '../locales/id.json'

// Get saved language or default to English
// Handle localStorage safely for SSR/initial load
let savedLanguage = 'en'
try {
  if (typeof window !== 'undefined') {
    savedLanguage = localStorage.getItem('language') || 'en'
  }
} catch (error) {
  console.warn('Failed to read language from localStorage:', error)
}

// Validate language code
const validLanguages = ['en', 'id']
if (!validLanguages.includes(savedLanguage)) {
  savedLanguage = 'en'
}

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      id: {
        translation: idTranslation
      }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: false, // Disable debug in production
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // Disable suspense to prevent errors
    },
    // Add compatibility options
    compatibilityJSON: 'v3',
    returnEmptyString: false,
    returnNull: false
  })
  .catch((error) => {
    console.error('Failed to initialize i18n:', error)
  })

export default i18n
