export const useAuthActions = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const logout = async () => {
    try {
      await authStore.logout()
      await router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return {
    logout
  }
} 