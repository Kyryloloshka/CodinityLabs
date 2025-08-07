export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  await authStore.initializeAuth()
  
  if (authStore.isAuthenticated) {
    setInterval(async () => {
      try {
        await authStore.refreshAccessToken()
      } catch (error) {
        console.error('Auto token refresh failed:', error)
      }
    }, 50 * 1000)
  }
}) 