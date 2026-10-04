import { useState } from 'react'
import { Check, AlertCircle, Loader2, BookOpen } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function AuthPage() {
  const { t } = useTranslation()
  const { login: authLogin, checkAuth } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!isLogin) {
      // Validate name
      if (name.trim().length < 2) {
        setError(t('auth.validation.nameLength'))
        return
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        setError(t('auth.validation.passwordMatch'))
        return
      }

      // Validate password strength
      if (password.length < 8) {
        setError(t('auth.validation.passwordLength'))
        return
      }
      if (!/[A-Z]/.test(password)) {
        setError(t('auth.validation.passwordUppercase'))
        return
      }
      if (!/[a-z]/.test(password)) {
        setError(t('auth.validation.passwordLowercase'))
        return
      }
      if (!/[0-9]/.test(password)) {
        setError(t('auth.validation.passwordNumber'))
        return
      }

      // Validate terms agreement
      if (!agreeTerms) {
        setError(t('auth.validation.agreeTermsRequired'))
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        // Login using auth context
        const result = await authLogin(email, password)
        
        if (!result.success) {
          setError(result.error || t('auth.error.loginFailed'))
        } else {
          setSuccess(t('auth.success.login'))
          
          // Check auth to update context
          await checkAuth()
          
          // Redirect to home after 1 second
          setTimeout(() => {
            window.history.pushState({}, '', '/')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }, 1000)
        }
      } else {
        // Register
        const response = await api.register(email, password, name)
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setSuccess(t('auth.success.register'))
          
          // Switch to login form after 2 seconds
          setTimeout(() => {
            setIsLogin(true)
            setPassword('')
            setConfirmPassword('')
            setSuccess('')
          }, 2000)
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.error.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <img 
            src="/bible_side_panel.jpg" 
            alt="Holy Bible" 
            className="w-full h-full object-cover opacity-85"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="896"
            height="1200"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
        </div>
        
        {/* Top Logo */}
        <div className="relative z-10 p-8 sm:p-12">
          <div className="flex items-center gap-3 text-white font-bold text-2xl tracking-tight">
            <BookOpen className="w-8 h-8" />
            Holy Bible
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 p-8 sm:p-12 mt-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6 max-w-lg shadow-sm">
            "Your word is a lamp to my feet and a light to my path."
          </h2>
          <div>
            <p className="text-white font-bold text-lg">Psalm 119:105</p>
            <p className="text-gray-300 text-sm font-medium mt-1">The Holy Scriptures</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="text-center space-y-2">
            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
              {isLogin ? "Welcome Back to Holy Bible" : "Join the Holy Bible"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? "Access your scriptures effortlessly with our platform." : "Create an account to access all features."}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 animate-in fade-in">
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative rounded-xl border border-gray-300 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all bg-white px-3.5 py-2.5">
                <label className="block text-xs font-semibold text-gray-500 mb-0.5">{t('auth.username')}</label>
                <input
                  type="text"
                  placeholder={t('auth.username')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>
            )}
            
            <div className="relative rounded-xl border border-gray-300 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all bg-white px-3.5 py-2.5">
              <label className="block text-xs font-semibold text-gray-500 mb-0.5">Email</label>
              <input
                type="email"
                placeholder="alex.jordan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                required
              />
            </div>

            <div className="relative rounded-xl border border-gray-300 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all bg-white px-3.5 py-2.5">
              <label className="block text-xs font-semibold text-gray-500 mb-0.5">Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative rounded-xl border border-gray-300 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1] transition-all bg-white px-3.5 py-2.5">
                <label className="block text-xs font-semibold text-gray-500 mb-0.5">{t('auth.confirmPassword')}</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="text-left mt-2">
                <button 
                  type="button"
                  onClick={() => setError('Fitur reset kata sandi sedang dalam pemeliharaan. Silakan hubungi admin atau daftar akun baru.')}
                  className="text-sm text-[#6366f1] font-semibold hover:text-[#4f46e5] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <label className="flex items-start gap-3 cursor-pointer pt-2 group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1] transition-all cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{t('auth.agreeTerms')}</span>
              </label>
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-4 pb-2">
                <span className="text-sm text-gray-500 font-medium">Remember sign in details</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1] shadow-inner"></div>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 mt-2 bg-[#7154ff] hover:bg-[#5a43cc] text-white font-semibold rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? "Log in" : "Sign up"
              )}
            </button>
          </form>

          <div className="text-center pt-8 text-xs text-gray-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#6366f1] font-bold hover:underline ml-1"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
          
          <div className="text-center mt-2">
             <button
              onClick={() => {
                window.history.pushState({}, '', '/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t('auth.continueAsGuest')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
