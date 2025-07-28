export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Ініціалізуємо авторизацію при завантаженні додатку
  await authStore.initializeAuth()
}) 