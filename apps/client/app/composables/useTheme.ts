export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    updateTheme()
  }
  
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    updateTheme()
  }
  
  const updateTheme = () => {
    if (process.client) {
      // Встановлюємо data-theme атрибут для наших CSS змінних
      document.documentElement.setAttribute('data-theme', theme.value)
      
      // Додаємо/видаляємо клас 'dark' для Tailwind CSS
      if (theme.value === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      localStorage.setItem('theme', theme.value)
    }
  }
  
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme) {
        theme.value = savedTheme
      } else if (prefersDark) {
        theme.value = 'dark'
      }
      
      updateTheme()
      
      // Додаткове забезпечення правильного встановлення
      setTimeout(() => {
        updateTheme()
      }, 100)
    }
  }
  
  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
    initTheme
  }
} 