import { useState, useEffect } from 'react'
import { Book, Moon, Sun, Menu, X, User, LogOut, Bookmark, Globe, Calendar, FileText, ListChecks, Search, MessageSquare } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { AvatarPickerModal } from '@/components/AvatarPickerModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from 'react-i18next'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  const { language, setLanguage, availableLanguages } = useLanguage()
  const { t } = useTranslation()
  const [darkMode, setDarkMode] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTopMenu, setShowTopMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false)
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const getInitials = (name?: string, email?: string) => {
    const source = (name && name.trim()) || (email && email.split('@')[0]) || ''
    const parts = source.split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    if (parts.length === 1 && parts[0]) return parts[0].slice(0, 2).toUpperCase()
    return 'U'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur supports-backdrop-filter:bg-[#0f172a]/90">
        <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Book className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">{t('app.title')}</span>
            </button>
          </div>

          {/* Right Controls */}

          <div className="flex items-center gap-3">
            {/* Top-right Menu */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTopMenu(!showTopMenu)}
                className="hover:bg-gray-800 text-gray-300"
              >
                <Menu className="h-4 w-4 mr-2" />{t('nav.menu') || 'Menu'}
              </Button>
              {showTopMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowTopMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 py-2">
                    <button
                      onClick={() => { setShowTopMenu(false); handleNavClick('/') }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                    >
                      <Book className="h-4 w-4" /> {t('nav.read')}
                    </button>
                    <button
                      onClick={() => { setShowTopMenu(false); handleNavClick('/search') }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" /> {t('nav.search')}
                    </button>
                    {isAuthenticated && (
                      <>
                        <div className="border-t border-gray-700 my-2" />
                        <button onClick={() => { setShowTopMenu(false); handleNavClick('/bookmarks') }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                          <Bookmark className="h-4 w-4" /> {t('nav.bookmarks')}
                        </button>
                        <button onClick={() => { setShowTopMenu(false); handleNavClick('/daily-verse') }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {t('nav.dailyVerse') || 'Daily Verse'}
                        </button>
                        <button onClick={() => { setShowTopMenu(false); handleNavClick('/prayer') }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> {t('nav.prayer') || 'Prayer'}
                        </button>
                        <button onClick={() => { setShowTopMenu(false); handleNavClick('/notes') }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                          <FileText className="h-4 w-4" /> {t('nav.notes') || 'Notes'}
                        </button>
                        <button onClick={() => { setShowTopMenu(false); handleNavClick('/plan') }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                          <ListChecks className="h-4 w-4" /> {t('nav.readingPlan') || 'Reading Plan'}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="hover:bg-gray-800 text-gray-300"
              >
                <Globe className="h-5 w-5" />
              </Button>
              
              {showLanguageMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLanguageMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 py-2">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setShowLanguageMenu(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:bg-gray-800 text-gray-300 hidden sm:flex">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Auth Button - Login or User Menu */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-800 text-white"
                >
                  <span className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-500/30 overflow-hidden grid place-items-center">
                    {(user as any)?.avatarUrl || (user as any)?.photoURL ? (
                      <img src={(user as any).avatarUrl || (user as any).photoURL} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-blue-200">
                        {getInitials(user?.name, user?.email)}
                      </span>
                    )}
                  </span>
                  <span className="max-w-[140px] truncate">{user?.name || user?.email}</span>
                </Button>
                
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                          {user?.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          setShowAvatarPicker(true)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        🖼️ Change Avatar
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleNavClick('/auth')}
                className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {t('nav.login')}
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-gray-800 text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        open={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={(url) => {
          updateUser({ avatarUrl: url })
          setShowAvatarPicker(false)
        }}
      />

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="fixed top-16 left-0 right-0 bg-[#0f172a] border-b border-gray-800 shadow-2xl animate-in slide-in-from-top duration-200">
            <nav className="container mx-auto px-6 py-4 space-y-1">
              {/* User Info - Show if authenticated */}
              {isAuthenticated && user && (
                <>
                  <div className="px-4 py-3 bg-gray-800/50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30 overflow-hidden grid place-items-center">
                        {(user as any)?.avatarUrl || (user as any)?.photoURL ? (
                          <img src={(user as any).avatarUrl || (user as any).photoURL} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-blue-200">
                            {getInitials(user?.name, user?.email)}
                          </span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAvatarPicker(true)
                        }}
                        className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Ganti Avatar
                      </button>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                      {user.role}
                    </span>
                  </div>
                  <div className="border-t border-gray-800 my-2"></div>
                </>
              )}
              
              <button
                onClick={() => handleNavClick('/')}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                📖 {t('nav.read')}
              </button>
              <button
                onClick={() => handleNavClick('/search')}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                🔍 {t('nav.search')}
              </button>
              
              {/* Bookmarks - Only for logged in users */}
              {isAuthenticated ? (
                <button
                  onClick={() => handleNavClick('/bookmarks')}
                  className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Bookmark className="h-5 w-5" />
                  {t('nav.bookmarks')}
                </button>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 bg-gray-800/30 rounded-lg flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>{t('nav.loginToAccess')}</span>
                </div>
              )}

              {/* Premium features in mobile for authenticated users */}
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => handleNavClick('/daily-verse')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Calendar className="h-5 w-5" />
                    {t('nav.dailyVerse') || 'Daily Verse'}
                  </button>
                  <button
                    onClick={() => handleNavClick('/prayer')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <MessageSquare className="h-5 w-5" />
                    {t('nav.prayer') || 'Prayer'}
                  </button>
                  <button
                    onClick={() => handleNavClick('/notes')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <FileText className="h-5 w-5" />
                    {t('nav.notes') || 'Notes'}
                  </button>
                  <button
                    onClick={() => handleNavClick('/plan')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <ListChecks className="h-5 w-5" />
                    {t('nav.readingPlan') || 'Reading Plan'}
                  </button>
                </>
              )}
              
              <div className="border-t border-gray-800 my-2"></div>
              
              <button
                onClick={toggleDarkMode}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-3"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {darkMode ? t('nav.lightMode') : t('nav.darkMode')}
              </button>
              
              {/* Language Selector in Mobile Menu */}
              <div className="px-4 py-3 text-sm font-medium text-gray-400">
                🌐 {t('nav.language') || 'Language'}
              </div>
              <div className="px-4 space-y-2">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <span className="text-base mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
              
              {/* Login or Logout Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full text-left px-4 py-3 text-base font-medium bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-3"
                >
                  <LogOut className="h-5 w-5" />
                  {t('nav.logout')}
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('/auth')}
                  className="w-full text-left px-4 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-3"
                >
                  <User className="h-5 w-5" />
                  {t('nav.login')}
                </button>
              )}
            </nav>
          </div>
        </div>
      )}


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
