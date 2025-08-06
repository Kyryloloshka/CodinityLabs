export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // Чекаємо поки додаток ініціалізується
  if (!authStore.isInitialized) {
    // Повертаємо undefined, щоб middleware не блокував навігацію
    // Layout покаже завантажувальний екран
    return
  }
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
}) 