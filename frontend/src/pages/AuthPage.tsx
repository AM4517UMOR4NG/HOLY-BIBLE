import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookOpen, Mail, Lock, User, Check, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { JesusTeachingAnimatedBG } from '@/components/JesusTeachingAnimatedBG'

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f172a]">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-700 py-8">
          {/* Logo & Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/50 mb-4 transform hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {t('app.title')}
            </h1>
            <p className="text-gray-400 text-lg">
              {isLogin ? t('auth.welcomeBack') : t('auth.startJourney')}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-[#1e293b] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700 transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              {isLogin ? t('auth.signIn') : t('auth.signUp')}
            </h2>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 animate-in fade-in slide-in-from-top duration-300">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 animate-in fade-in slide-in-from-top duration-300">
                <Check className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Password Requirements Info */}
            {!isLogin && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 font-medium mb-2">{t('auth.passwordRequirements.title')}</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    {t('auth.passwordRequirements.length')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    {t('auth.passwordRequirements.uppercase')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    {t('auth.passwordRequirements.lowercase')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    {t('auth.passwordRequirements.number')}
                  </li>
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('auth.username')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('auth.username')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 sm:h-12 bg-[#0f172a] border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('auth.email')}
                </label>
                <Input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-[#0f172a] border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t('auth.password')}
                </label>
                <Input
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-[#0f172a] border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t('auth.confirmPassword')}
                  </label>
                  <Input
                    type="password"
                    placeholder={t('auth.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 sm:h-12 bg-[#0f172a] border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                    required
                  />
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${
                      agreeTerms 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-600 group-hover:border-blue-500'
                    }`}>
                      {agreeTerms && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">
                    {t('auth.agreeTerms')}
                  </span>
                </label>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                    <input type="checkbox" className="rounded border-gray-600 bg-[#0f172a] text-blue-500" />
                    {t('auth.rememberMe')}
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 sm:h-12 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/50 transform hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                  </>
                ) : (
                  isLogin ? t('auth.signInButton') : t('auth.signUpButton')
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-400">
                  {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                >
                  {isLogin ? t('auth.signUp') : t('auth.signIn')}
                </button>
              </div>
            </form>
          </div>

          {/* Guest Access */}
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
              onClick={() => {
                window.history.pushState({}, '', '/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
            >
              {t('auth.continueAsGuest')}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section with Jesus Teaching Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen">
        {/* Jesus Teaching Animated Background - Full Screen */}
        <JesusTeachingAnimatedBG />
      </div>
    </div>
  )
}
