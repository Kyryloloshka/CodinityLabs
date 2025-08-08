export const useThemeManager = () => {
  const { theme } = useTheme()

  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  const toggleTheme = () => {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  const setTheme = (newTheme: 'dark' | 'light') => {
    theme.value = newTheme
  }

  const getThemeIcon = () => {
    return isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon'
  }

  const getThemeLabel = () => {
    return isDark.value ? 'Світла тема' : 'Темна тема'
  }

  const getThemeColor = () => {
    return isDark.value ? 'warning' : 'primary'
  }

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    getThemeIcon,
    getThemeLabel,
    getThemeColor
  }
} 