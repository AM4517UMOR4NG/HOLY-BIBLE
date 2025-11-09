export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error response with detailed errors array
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ')
          return { error: errorMessages }
        }
        return { error: data.message || 'An error occurred' }
      }

      return { data }
    } catch (error) {
      return { error: 'Network error. Please check your connection and try again.' }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ success: boolean; message: string; accessToken: string; refreshToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ success: boolean; message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  // Bible endpoints
  async getBooks() {
    return this.request<any[]>('/bible/books')
  }

  async getChapter(book: string, chapter: number) {
    return this.request<any>(`/bible/${book}/${chapter}`)
  }

  async getVerse(book: string, chapter: number, verse: number) {
    return this.request<any>(`/bible/${book}/${chapter}/${verse}`)
  }

  // Search endpoint
  async search(query: string) {
    return this.request<any[]>(`/search?q=${encodeURIComponent(query)}`)
  }

  // Bookmark endpoints
  async getBookmarks() {
    return this.request<any[]>('/bookmarks')
  }

  async createBookmark(book: string, chapter: number, verse: number, note?: string) {
    return this.request<any>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ book, chapter, verse, note }),
    })
  }

  async deleteBookmark(id: number) {
    return this.request<void>(`/bookmarks/${id}`, {
      method: 'DELETE',
    })
  }

  // Annotation endpoints
  async getAnnotations(book: string, chapter: number, verse: number) {
    return this.request<any[]>(`/annotations/${book}/${chapter}/${verse}`)
  }

  async createAnnotation(book: string, chapter: number, verse: number, text: string) {
    return this.request<any>('/annotations', {
      method: 'POST',
      body: JSON.stringify({ book, chapter, verse, text }),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
