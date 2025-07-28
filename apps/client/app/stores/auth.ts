import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false, // Новий стан для відстеження ініціалізації
  }),

  getters: {
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.authServiceUrl}/auth/login`, {
          method: 'POST',
          body: credentials,
        })

        this.setAuthData(response)
        return { success: true }
      } catch (error: unknown) {
        console.error('Login error:', error)
        const errorMessage = error && typeof error === 'object' && 'data' in error 
          ? (error.data as { message?: string })?.message || 'Помилка входу в систему'
          : 'Помилка входу в систему'
        return { 
          success: false, 
          error: errorMessage
        }
      } finally {
        this.isLoading = false
      }
    },

    async register(credentials: RegisterCredentials) {
      this.isLoading = true
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.authServiceUrl}/auth/register`, {
          method: 'POST',
          body: credentials,
        })

        this.setAuthData(response)
        return { success: true }
      } catch (error: unknown) {
        console.error('Register error:', error)
        const errorMessage = error && typeof error === 'object' && 'data' in error 
          ? (error.data as { message?: string })?.message || 'Помилка реєстрації'
          : 'Помилка реєстрації'
        return { 
          success: false, 
          error: errorMessage
        }
      } finally {
        this.isLoading = false
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.authServiceUrl}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        })

        this.setAuthData(response)
        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        this.logout()
        return false
      }
    },

    setAuthData(data: AuthTokens & { user: User }) {
      this.user = data.user
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.isAuthenticated = true

      // Зберігаємо в localStorage
      if (import.meta.client) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false

      // Очищаємо localStorage
      if (import.meta.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    async initializeAuth() {
      if (import.meta.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        if (accessToken && refreshToken && userStr) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
          
                  // Спробуємо перевірити токен
        const isValid = await this.validateToken()
        if (!isValid) {
          this.logout()
        }
        }
        
        this.isInitialized = true
      } else {
        this.isInitialized = true
      }
    },

    async validateToken() {
      if (!this.accessToken) {
        return false
      }

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.authServiceUrl}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        })
        return true
      } catch (error) {
        console.error('Token validation error:', error)
        return false
      }
    },

    async getAuthHeaders() {
      return {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },
}) 