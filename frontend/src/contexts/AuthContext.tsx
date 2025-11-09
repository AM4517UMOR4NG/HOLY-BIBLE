import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, API_BASE_URL } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (patch: Partial<User> & { avatarUrl?: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token by fetching current user
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          // merge with locally persisted profile (e.g., avatar)
          const persisted = localStorage.getItem('user_profile')
          const patch = persisted ? JSON.parse(persisted) : {}
          setUser({ ...data.user, ...patch })
        } else {
          // Invalid token, clear it
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        }
      } else {
        // Token expired or invalid
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const updateUser = (patch: Partial<User> & { avatarUrl?: string }) => {
    setUser((prev) => {
      const next: any = { ...(prev || {}), ...patch }
      // persist simple profile locally for demo
      localStorage.setItem('user_profile', JSON.stringify(next))
      return next
    })
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)

      if (response.error) {
        return { success: false, error: response.error }
      }

      if (response.data) {
        // Store tokens
        if (response.data.accessToken) {
          localStorage.setItem('auth_token', response.data.accessToken)
          api.setToken(response.data.accessToken)
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

        // Set user
        if (response.data.user) {
          const persisted = localStorage.getItem('user_profile')
          const patch = persisted ? JSON.parse(persisted) : {}
          setUser({ ...response.data.user, ...patch })
        }

        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      // Call logout endpoint
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state
      setUser(null)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      api.clearToken()

      // Redirect to home
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
