export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  try {
    // Ініціалізуємо авторизацію при завантаженні додатку
    await authStore.initializeAuth()
  } catch (error) {
    console.error('Auth initialization error:', error)
    // Навіть якщо є помилка, позначаємо як ініціалізоване
    // щоб користувач міг продовжити роботу
    authStore.isInitialized = true
  }
}) 