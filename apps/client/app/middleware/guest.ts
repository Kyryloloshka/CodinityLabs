export default defineNuxtRouteMiddleware((to: any) => {
  const authStore = useAuthStore()
  
  // Логуємо спробу доступу до гостевої сторінки
  console.log(`Guest middleware: attempting to access ${to.path}`)
  
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
}) 