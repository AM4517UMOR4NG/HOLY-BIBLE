import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../locales/en.json'
import idTranslation from '../locales/id.json'
import esTranslation from '../locales/es.json'
import ptTranslation from '../locales/pt.json'
import zhTranslation from '../locales/zh.json'
import koTranslation from '../locales/ko.json'

// Safe function to get saved language (works on both client and server)
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

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        translation: idTranslation
      },
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      },
      pt: {
        translation: ptTranslation
      },
      zh: {
        translation: zhTranslation
      },
      ko: {
        translation: koTranslation
      }
    },
    lng: getSavedLanguage(),
    fallbackLng: 'id', // Changed to Indonesian as primary fallback
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Add these options for better SSR support
    react: {
      useSuspense: false
    }
  })

export default i18n
