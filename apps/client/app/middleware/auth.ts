export default defineNuxtRouteMiddleware((to: any) => {
  const authStore = useAuthStore()
  
  // Логуємо спробу доступу до захищеної сторінки
  console.log(`Auth middleware: attempting to access ${to.path}`)
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login', { redirectCode: 401 })
  }
}) 