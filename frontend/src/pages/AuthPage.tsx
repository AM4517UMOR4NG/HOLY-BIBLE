import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, Check, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { JesusTeachingScene } from '@/components/AnimationLogRes'

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
    <>
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes divine-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes rotate-light {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
      <div className="min-h-screen w-full flex flex-col lg:flex-row" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0f0f1e 40%, #050510 100%)'
      }}>
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 min-h-screen lg:min-h-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0f0f1e 40%, #050510 100%)',
        position: 'relative'
      }}>
        {/* Elegant floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full opacity-60" style={{
            background: 'radial-gradient(circle, #fff5e6 0%, transparent 70%)',
            animation: 'float-up 8s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(255,223,186,0.8)'
          }}></div>
          <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full opacity-40" style={{
            background: 'radial-gradient(circle, #ffe4cc 0%, transparent 70%)',
            animation: 'float-up 10s ease-in-out infinite 2s',
            boxShadow: '0 0 8px rgba(255,212,163,0.6)'
          }}></div>
          <div className="absolute bottom-30 left-20 w-1 h-1 rounded-full opacity-50" style={{
            background: 'radial-gradient(circle, #ffd4a3 0%, transparent 70%)',
            animation: 'float-up 12s ease-in-out infinite 1s',
            boxShadow: '0 0 6px rgba(255,179,102,0.7)'
          }}></div>
        </div>

        <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-1000 py-8 relative z-10">
          {/* Divine Light Header - Replace Avatar */}
          <div className="text-center space-y-6">
            {/* Divine Light Animation */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
              {/* Divine glow effect */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle, #fff5e6 0%, #ffe4cc 30%, #ffd4a3 60%, transparent 100%)',
                boxShadow: '0 0 80px rgba(255,223,186,0.8), 0 0 120px rgba(255,212,163,0.6), 0 0 200px rgba(255,179,102,0.4)',
                animation: 'divine-pulse 4s ease-in-out infinite'
              }}></div>
              
              {/* Light rays */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: 'conic-gradient(from 0deg, transparent, #ffe4cc, transparent, #ffd4a3, transparent, #ffe4cc, transparent)',
                  animation: 'rotate-light 20s linear infinite'
                }}></div>
                <div className="absolute inset-2 rounded-full" style={{
                  background: 'radial-gradient(circle, #1a1a2e 0%, #0f0f1e 100%)'
                }}></div>
              </div>
              
              {/* Center divine spark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full" style={{
                  background: 'radial-gradient(circle, #fff5e6 0%, #ffe4cc 50%, #ffd4a3 100%)',
                  boxShadow: '0 0 20px rgba(255,223,186,1), 0 0 40px rgba(255,212,163,0.8)',
                  animation: 'sparkle 2s ease-in-out infinite'
                }}></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom duration-1000" style={{
              background: 'linear-gradient(135deg, #ffe4cc 0%, #ffd4a3 50%, #ffb366 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255,223,186,0.6), 0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.02em'
            }}>
              {t('app.title')}
            </h1>
            <p className="text-xl animate-in fade-in slide-in-from-bottom duration-1200" style={{
              color: '#ffd4a3',
              textShadow: '0 0 15px rgba(255,223,186,0.4), 0 2px 4px rgba(0,0,0,0.2)',
              fontWeight: '300',
              letterSpacing: '0.01em'
            }}>
              {isLogin ? t('auth.welcomeBack') : t('auth.startJourney')}
            </p>
          </div>

          {/* Auth Form - Transparent Divine */}
          <div className="backdrop-blur-md rounded-3xl p-8 transform transition-all duration-700 hover:scale-[1.02]" style={{
            background: 'linear-gradient(135deg, rgba(26,26,46,0.15) 0%, rgba(15,15,30,0.1) 50%, rgba(5,5,16,0.05) 100%)',
            border: '1px solid rgba(255,223,186,0.2)',
            boxShadow: '0 0 40px rgba(255,223,186,0.15), 0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
            transform: 'perspective(1200px) rotateX(1deg) rotateY(-0.5deg)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ethereal corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-3xl" style={{
              background: 'linear-gradient(135deg, #ffe4cc 0%, transparent 70%)',
              opacity: '0.15'
            }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-3xl" style={{
              background: 'linear-gradient(225deg, #ffe4cc 0%, transparent 70%)',
              opacity: '0.15'
            }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-3xl" style={{
              background: 'linear-gradient(45deg, #ffe4cc 0%, transparent 70%)',
              opacity: '0.15'
            }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-3xl" style={{
              background: 'linear-gradient(315deg, #ffe4cc 0%, transparent 70%)',
              opacity: '0.15'
            }}></div>
            
            {/* Floating light particles inside form */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-8 w-1.5 h-1.5 rounded-full opacity-40" style={{
                background: 'radial-gradient(circle, #ffe4cc 0%, transparent 70%)',
                animation: 'float-up 10s ease-in-out infinite',
                boxShadow: '0 0 6px rgba(255,223,186,0.6)'
              }}></div>
              <div className="absolute top-20 right-12 w-1 h-1 rounded-full opacity-30" style={{
                background: 'radial-gradient(circle, #ffd4a3 0%, transparent 70%)',
                animation: 'float-up 12s ease-in-out infinite 3s',
                boxShadow: '0 0 4px rgba(255,212,163,0.5)'
              }}></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{
              color: '#ffe4cc',
              textShadow: '0 0 15px rgba(255,223,186,0.6), 0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {isLogin ? t('auth.signIn') : t('auth.signUp')}
            </h2>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg animate-in fade-in slide-in-from-top duration-300" style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                boxShadow: '0 0 20px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#f87171' }} />
                <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 rounded-lg animate-in fade-in slide-in-from-top duration-300" style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 0 20px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#4ade80' }} />
                <p className="text-sm" style={{ color: '#86efac' }}>{success}</p>
              </div>
            )}

            {/* Password Requirements Info */}
            {!isLogin && (
              <div className="p-3 rounded-lg" style={{
                background: 'rgba(255,223,186,0.1)',
                border: '1px solid rgba(255,223,186,0.2)',
                boxShadow: '0 0 15px rgba(255,223,186,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#ffd4a3' }}>{t('auth.passwordRequirements.title')}</p>
                <ul className="text-xs space-y-1" style={{ color: '#ffe4cc' }}>
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
                <div className="space-y-3 animate-in fade-in slide-in-from-left duration-700">
                  <label className="text-sm font-medium flex items-center gap-2 transition-all duration-300" style={{ 
                    color: '#ffd4a3',
                    textShadow: '0 0 8px rgba(255,223,186,0.4)',
                    letterSpacing: '0.01em'
                  }}>
                    <User className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px rgba(255,223,186,0.6))' }} />
                    {t('auth.username')}
                  </label>
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder={t('auth.username')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-sm sm:text-base transition-all duration-500 peer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(15,15,30,0.4) 0%, rgba(26,26,46,0.3) 100%)',
                        border: '1px solid rgba(255,223,186,0.15)',
                        color: '#ffe4cc',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255,223,186,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        transform: 'perspective(1200px) rotateX(-1deg)',
                        backdropFilter: 'blur(8px)'
                      }}
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      background: 'linear-gradient(135deg, rgba(255,223,186,0.08) 0%, rgba(255,212,163,0.04) 100%)',
                      boxShadow: '0 0 20px rgba(255,223,186,0.15)'
                    }}></div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 animate-in fade-in slide-in-from-left duration-800">
                <label className="text-sm font-medium flex items-center gap-2 transition-all duration-300" style={{ 
                  color: '#ffd4a3',
                  textShadow: '0 0 8px rgba(255,223,186,0.4)',
                  letterSpacing: '0.01em'
                }}>
                  <Mail className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px rgba(255,223,186,0.6))' }} />
                  {t('auth.email')}
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 transition-all duration-500 peer"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,223,186,0.15)',
                      color: '#ffe4cc',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255,223,186,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      transform: 'perspective(1200px) rotateX(-1deg)',
                      backdropFilter: 'blur(8px)'
                    }}
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: 'linear-gradient(135deg, rgba(255,223,186,0.08) 0%, rgba(255,212,163,0.04) 100%)',
                    boxShadow: '0 0 20px rgba(255,223,186,0.15)'
                  }}></div>
                </div>
              </div>

              <div className="space-y-3 animate-in fade-in slide-in-from-left duration-900">
                <label className="text-sm font-medium flex items-center gap-2 transition-all duration-300" style={{ 
                  color: '#ffd4a3',
                  textShadow: '0 0 8px rgba(255,223,186,0.4)',
                  letterSpacing: '0.01em'
                }}>
                  <Lock className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px rgba(255,223,186,0.6))' }} />
                  {t('auth.password')}
                </label>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 transition-all duration-500 peer"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,223,186,0.15)',
                      color: '#ffe4cc',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255,223,186,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      transform: 'perspective(1200px) rotateX(-1deg)',
                      backdropFilter: 'blur(8px)'
                    }}
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: 'linear-gradient(135deg, rgba(255,223,186,0.08) 0%, rgba(255,212,163,0.04) 100%)',
                    boxShadow: '0 0 20px rgba(255,223,186,0.15)'
                  }}></div>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3 animate-in fade-in slide-in-from-left duration-1000">
                  <label className="text-sm font-medium flex items-center gap-2 transition-all duration-300" style={{ 
                    color: '#ffd4a3',
                    textShadow: '0 0 8px rgba(255,223,186,0.4)',
                    letterSpacing: '0.01em'
                  }}>
                    <Lock className="h-4 w-4" style={{ filter: 'drop-shadow(0 0 4px rgba(255,223,186,0.6))' }} />
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative group">
                    <Input
                      type="password"
                      placeholder={t('auth.confirmPassword')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 text-sm sm:text-base transition-all duration-500 peer"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,223,186,0.15)',
                        color: '#ffe4cc',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255,223,186,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        transform: 'perspective(1200px) rotateX(-1deg)',
                        backdropFilter: 'blur(8px)'
                      }}
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      background: 'linear-gradient(135deg, rgba(255,223,186,0.08) 0%, rgba(255,212,163,0.04) 100%)',
                      boxShadow: '0 0 20px rgba(255,223,186,0.15)'
                    }}></div>
                  </div>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer group animate-in fade-in slide-in-from-left duration-1100">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-xl border-2 transition-all duration-500 relative overflow-hidden`} style={{
                      borderColor: agreeTerms ? '#ffe4cc' : 'rgba(255,223,186,0.3)',
                      background: agreeTerms ? 'linear-gradient(135deg, #ffe4cc 0%, #ffd4a3 50%, #ffb366 100%)' : 'transparent',
                      boxShadow: agreeTerms ? '0 0 20px rgba(255,223,186,0.6), inset 0 2px 4px rgba(255,255,255,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                      transform: agreeTerms ? 'scale(1.1)' : 'scale(1)'
                    }}>
                      {agreeTerms && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-[#3d2314] animate-in zoom-in duration-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)'
                      }}></div>
                    </div>
                  </div>
                  <span className="text-sm transition-all duration-300" style={{ 
                    color: '#ffd4a3',
                    textShadow: '0 0 6px rgba(255,223,186,0.3)',
                    letterSpacing: '0.01em'
                  }}>
                    {t('auth.agreeTerms')}
                  </span>
                </label>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-left duration-1100">
                  <label className="flex items-center gap-2 cursor-pointer transition-all duration-300 group" style={{ 
                    color: '#ffd4a3',
                    textShadow: '0 0 6px rgba(255,223,186,0.3)'
                  }}>
                    <input 
                      type="checkbox" 
                      className="rounded-lg w-4 h-4 transition-all duration-300" 
                      style={{
                        background: 'rgba(15,15,30,0.95)',
                        border: '1px solid rgba(255,223,186,0.3)',
                        color: '#ffd4a3',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      }} 
                    />
                    <span className="transition-all duration-300 group-hover:text-[#ffe4cc]">{t('auth.rememberMe')}</span>
                  </label>
                  <a href="#" className="transition-all duration-300 hover:scale-105" style={{ 
                    color: '#ffd4a3',
                    textShadow: '0 0 6px rgba(255,223,186,0.3)'
                  }}>
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-13 sm:h-14 font-bold transform text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group animate-in fade-in slide-in-from-bottom duration-1200"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,223,186,0.7) 0%, rgba(255,212,163,0.6) 30%, rgba(255,179,102,0.5) 70%, rgba(255,153,51,0.4) 100%)',
                  color: '#3d2314',
                  boxShadow: '0 0 25px rgba(255,223,186,0.4), 0 8px 25px rgba(255,212,163,0.2), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,223,186,0.3)',
                  borderRadius: '16px',
                  transform: 'perspective(1200px) rotateX(-1deg)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  transition: 'all 0.5s ease',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  transition: 'opacity 0.5s ease'
                }}></div>
                <div className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" style={{ filter: 'drop-shadow(0 0 4px rgba(255,223,186,0.8))' }} />
                      {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">{isLogin ? '🔓' : '✨'}</span>
                      {isLogin ? t('auth.signInButton') : t('auth.signUpButton')}
                    </>
                  )}
                </div>
              </Button>

              <div className="text-center text-sm animate-in fade-in slide-in-from-bottom duration-1300">
                <span style={{ 
                  color: '#ffd4a3',
                  textShadow: '0 0 6px rgba(255,223,186,0.3)',
                  letterSpacing: '0.01em'
                }}>
                  {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold transition-all duration-300 ml-2 hover:scale-105 relative group"
                  style={{ 
                    color: '#ffe4cc',
                    textShadow: '0 0 10px rgba(255,223,186,0.6)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {isLogin ? t('auth.signUp') : t('auth.signIn')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{
                    background: 'linear-gradient(90deg, #ffe4cc 0%, #ffb366 100%)'
                  }}></div>
                </button>
              </div>
            </form>
          </div>

          {/* Guest Access */}
          <div className="text-center animate-in fade-in slide-in-from-bottom duration-1400">
            <Button
              variant="ghost"
              className="transform hover:scale-105 relative overflow-hidden group animate-in fade-in slide-in-from-bottom duration-1400"
              style={{
                color: '#ffd4a3',
                background: 'linear-gradient(135deg, rgba(255,223,186,0.08) 0%, rgba(255,212,163,0.04) 100%)',
                border: '1px solid rgba(255,223,186,0.15)',
                boxShadow: '0 0 12px rgba(255,223,186,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                borderRadius: '12px',
                textShadow: '0 0 8px rgba(255,223,186,0.4)',
                letterSpacing: '0.01em',
                transition: 'all 0.5s ease',
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => {
                window.history.pushState({}, '', '/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transition: 'opacity 0.5s ease'
              }}></div>
              <span className="relative z-10 flex items-center">
                <span className="mr-2">👤</span>
                {t('auth.continueAsGuest')}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section with Jesus Teaching Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0f0f1e 40%, #050510 100%)'
      }}>
        {/* Jesus Teaching Scene - Full Screen */}
        <JesusTeachingScene />
      </div>
    </div>
    </>
  )
}
