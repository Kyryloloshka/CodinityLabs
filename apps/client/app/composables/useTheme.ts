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
      document.documentElement.setAttribute('data-theme', theme.value)
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
      
      // Додатково встановлюємо атрибут на html елементі
      document.documentElement.setAttribute('data-theme', theme.value)
      
      // Принудово оновлюємо тему ще раз для впевненості
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', theme.value)
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