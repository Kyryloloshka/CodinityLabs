export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (authStore.user?.role !== 'STUDENT') {
    return navigateTo('/')
  }
}) 