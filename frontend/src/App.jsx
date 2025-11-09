import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { Layout } from './components/Layout'
import { BibleReader } from './pages/BibleReader'
import { SearchPage } from './pages/SearchPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { AuthPage } from './pages/AuthPage'
import './i18n/config'
import { DailyVersePage } from './pages/DailyVersePage'
import { PrayerPage } from './pages/PrayerPage'
import { NotesPage } from './pages/NotesPage'
import { ReadingPlanPage } from './pages/ReadingPlanPage'

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname
    if (path === '/search') return 'search'
    if (path === '/bookmarks') return 'bookmarks'
    if (path === '/auth') return 'auth'
    if (path === '/daily-verse') return 'daily-verse'
    if (path === '/prayer') return 'prayer'
    if (path === '/notes') return 'notes'
    if (path === '/plan') return 'plan'
    return 'read'
  })

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path === '/search') {
        setCurrentPage('search')
      } else if (path === '/bookmarks') {
        setCurrentPage('bookmarks')
      } else if (path === '/auth') {
        setCurrentPage('auth')
      } else if (path === '/daily-verse') {
        setCurrentPage('daily-verse')
      } else if (path === '/prayer') {
        setCurrentPage('prayer')
      } else if (path === '/notes') {
        setCurrentPage('notes')
      } else if (path === '/plan') {
        setCurrentPage('plan')
      } else {
        setCurrentPage('read')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage />
      case 'bookmarks':
        return <BookmarksPage />
      case 'auth':
        return <AuthPage />
      case 'daily-verse':
        return <DailyVersePage />
      case 'prayer':
        return <PrayerPage />
      case 'notes':
        return <NotesPage />
      case 'plan':
        return <ReadingPlanPage />
      default:
        return <BibleReader />
    }
  }

  // Render auth page without layout (no navbar)
  if (currentPage === 'auth') {
    return <AuthPage />
  }

  return (
    <Layout>
      {renderPage()}
    </Layout>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
