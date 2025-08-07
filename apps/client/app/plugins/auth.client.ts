export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Ініціалізуємо авторизацію при завантаженні додатку
  await authStore.initializeAuth()
  
  // Додаємо автоматичне оновлення токена кожні 14 хвилин (токен живе 15 хвилин)
  if (authStore.isAuthenticated) {
    setInterval(async () => {
      try {
        await authStore.refreshAccessToken()
      } catch (error) {
        console.error('Auto token refresh failed:', error)
        // Не робимо logout автоматично, поки користувач активний
      }
    }, 14 * 60 * 1000) // 14 хвилин
  }
}) 