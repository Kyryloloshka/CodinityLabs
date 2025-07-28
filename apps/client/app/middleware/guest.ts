export default defineNuxtRouteMiddleware((to: any) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
}) 