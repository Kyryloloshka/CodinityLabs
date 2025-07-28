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

  return {
    async get<T>(endpoint: string): Promise<T> {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
    },
    
    async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data,
      })
    },
    
    async put<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data,
      })
    },
    
    async patch<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: data,
      })
    },
    
    async delete<T>(endpoint: string): Promise<T> {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    },
  }
} 