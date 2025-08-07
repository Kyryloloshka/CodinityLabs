export const useApi = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authStore.isAuthenticated && authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return headers
  }

  const handleResponse = async <T>(response: T): Promise<T> => {
    return response
  }

  const handleError = async (error: unknown) => {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      if (authStore.isAuthenticated && authStore.user) {
        const refreshed = await authStore.refreshAccessToken()
        if (refreshed) {
          throw new Error('RETRY_REQUEST')
        } else {
          await authStore.logoutAndRedirect()
          throw new Error('AUTH_FAILED')
        }
      } else {
        throw error
      }
    }
    throw error
  }

  const makeRequest = async <T>(
    method: string,
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> => {
    try {
      const options: any = {
        method,
        headers: getAuthHeaders(),
        credentials: 'include',
      }

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = data
      }

      const response = await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, options)
      return await handleResponse(response)
    } catch (error: unknown) {
      try {
        await handleError(error)
      } catch (handledError) {
        if (handledError instanceof Error && handledError.message === 'RETRY_REQUEST') {
          const options: any = {
            method,
            headers: getAuthHeaders(),
            credentials: 'include',
          }

          if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = data
          }

          // Якщо retry успішний, повертаємо результат без помилки
          const retryResponse = await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, options)
          return await handleResponse(retryResponse)
        }
        
        if (handledError instanceof Error && handledError.message === 'AUTH_FAILED') {
          // Не прокидаємо помилку далі, просто завершуємо виконання
          throw new Error('AUTH_CANCELLED')
        }
        
        throw handledError
      }
      
      throw error
    }
  }

  return {
    async get<T>(endpoint: string): Promise<T> {
      return makeRequest<T>('GET', endpoint)
    },
    
    async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return makeRequest<T>('POST', endpoint, data)
    },
    
    async put<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return makeRequest<T>('PUT', endpoint, data)
    },
    
    async patch<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return makeRequest<T>('PATCH', endpoint, data)
    },
    
    async delete<T>(endpoint: string): Promise<T> {
      return makeRequest<T>('DELETE', endpoint)
    },
  }
} 