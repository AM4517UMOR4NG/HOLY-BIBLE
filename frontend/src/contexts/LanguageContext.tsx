import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  availableLanguages: { code: string; name: string; flag: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [language, setLanguageState] = useState(() => {
    // Safe initialization for SSR
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem('language') || i18n.language || 'id'
      } catch (e) {
        return i18n.language || 'id'
      }
    }
    return 'id'
  })

  const availableLanguages = [
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ]

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    // Safe localStorage access
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('language', lang)
      } catch (e) {
        console.warn('Could not save language to localStorage:', e)
      }
    }
  }

  useEffect(() => {
    // Sync with i18n language changes
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Client-side only: sync with localStorage and i18n on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('language')
        if (savedLang && savedLang !== i18n.language) {
          i18n.changeLanguage(savedLang)
        }
      } catch (e) {
        console.warn('Could not read language from localStorage:', e)
      }
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
