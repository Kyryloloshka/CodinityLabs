export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  
  await authStore.initializeAuth()
  
  if (authStore.isAuthenticated) {
    const refreshIntervalMs = config.public.tokenRefreshIntervalMs
    
    setInterval(async () => {
      try {
        await authStore.refreshAccessToken()
      } catch (error) {
        console.error('Auto token refresh failed:', error)
      }
    }, refreshIntervalMs)
  }
}) 