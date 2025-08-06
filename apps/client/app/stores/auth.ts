import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthTokens {
  accessToken: string
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
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
  }),

  getters: {
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.apiBaseUrl}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: credentials,
          credentials: 'include',
        })

        this.setAuthData(response)
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return { success: false, error: 'Invalid email or password' }
        }
        return { success: false, error: 'Login error' }
      }
    },

    async register(credentials: RegisterCredentials) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.apiBaseUrl}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: credentials,
          credentials: 'include',
        })

        this.setAuthData(response)
        return { success: true }
      } catch (error) {
        console.error('Register error:', error)
        if (error && typeof error === 'object' && 'status' in error && error.status === 409) {
          return { success: false, error: 'User with this email already exists' }
        }
        return { success: false, error: 'Registration error' }
      }
    },

    async refreshAccessToken() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthTokens & { user: User }>(`${config.public.apiBaseUrl}/users/refresh`, {
          method: 'POST',
          credentials: 'include',
        })

        this.setAuthData(response)
        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          this.logout()
          return false
        }
        this.logout()
        return false
      }
    },

    setAuthData(data: AuthTokens & { user: User }) {
      this.user = data.user
      this.accessToken = data.accessToken
      this.isAuthenticated = true

      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('user')
      }

      if (import.meta.client) {
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    },

    async initializeAuth() {
      try {
        if (import.meta.client) {
          const userStr = localStorage.getItem('user')

          if (userStr) {
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true
            
            const refreshed = await this.refreshAccessToken()
            if (!refreshed) {
              this.logout()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        this.logout()
      } finally {
        this.isInitialized = true
      }
    },

    async validateToken() {
      if (!this.accessToken) {
        return false
      }

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBaseUrl}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          credentials: 'include',
        })
        return true
      } catch (error) {
        console.error('Token validation error:', error)
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          const refreshed = await this.refreshAccessToken()
          if (!refreshed) {
            this.logout()
          }
          return refreshed
        }
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