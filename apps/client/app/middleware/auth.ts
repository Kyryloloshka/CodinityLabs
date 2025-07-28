export default defineNuxtRouteMiddleware((_to: any) => {
  const authStore = useAuthStore()
  
  // Чекаємо поки додаток ініціалізується
  if (!authStore.isInitialized) {
    return
  }
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
}) 