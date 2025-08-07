export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Чекаємо поки додаток ініціалізується
  if (!authStore.isInitialized) {
    // Повертаємо undefined, щоб middleware не блокував навігацію
    // Layout покаже завантажувальний екран
    return
  }

  if (!authStore.isAuthenticated) {
    // Зберігаємо поточну сторінку для редіректу після авторизації
    if (process.client) {
      sessionStorage.setItem('redirectAfterAuth', to.fullPath)
    }
    return navigateTo('/login')
  }

  if (authStore.user?.role !== 'TEACHER') {
    console.warn('User is not a teacher, redirecting to home')
    return navigateTo('/')
  }
}) 