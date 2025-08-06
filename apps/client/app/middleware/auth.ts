export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  if (!authStore.isInitialized) {
    return
  }
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
}) 