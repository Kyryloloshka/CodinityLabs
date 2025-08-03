export default defineNuxtRouteMiddleware((to: any) => {
  const authStore = useAuthStore()

  const publicPages = ['/login', '/register', '/', '/assignments']

  const isAssignmentView = /^\/assignments\/[^/]+$/.test(to.path) && !to.path.includes('/edit') && !to.path.includes('/submit')

  if (!authStore.isAuthenticated && !publicPages.includes(to.path) && !isAssignmentView) {
    if (import.meta.client) {
      sessionStorage.setItem('redirectAfterAuth', to.fullPath)
    }
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    const redirectPath = import.meta.client ? sessionStorage.getItem('redirectAfterAuth') : null
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterAuth')
      return navigateTo(redirectPath)
    }
    return navigateTo('/')
  }
}) 