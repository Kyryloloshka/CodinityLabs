export const useErrorHandler = () => {
  const { showError } = useNotifications()

  const handleApiError = (error: any, context: string = '') => {
    console.error(`API Error in ${context}:`, error)
    
    let message = 'Сталася помилка'
    
    if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    
    showError('Помилка', message)
  }

  const handleNetworkError = (error: any, context: string = '') => {
    console.error(`Network Error in ${context}:`, error)
    
    let message = 'Помилка мережі'
    
    if (error?.code === 'NETWORK_ERROR') {
      message = 'Немає з\'єднання з сервером'
    } else if (error?.code === 'TIMEOUT') {
      message = 'Час очікування вичерпано'
    } else if (error?.message) {
      message = error.message
    }
    
    showError('Помилка мережі', message)
  }

  const handleValidationError = (errors: string[], context: string = '') => {
    console.error(`Validation Error in ${context}:`, errors)
    
    const message = errors.join('\n')
    showError('Помилка валідації', message)
  }

  const handleAuthError = (error: any, context: string = '') => {
    console.error(`Auth Error in ${context}:`, error)
    
    let message = 'Помилка авторизації'
    
    if (error?.message === 'INVALID_CREDENTIALS') {
      message = 'Невірний email або пароль'
    } else if (error?.message === 'USER_NOT_FOUND') {
      message = 'Користувача не знайдено'
    } else if (error?.message === 'TOKEN_EXPIRED') {
      message = 'Сесія закінчилася. Увійдіть знову'
    } else if (error?.message === 'INSUFFICIENT_PERMISSIONS') {
      message = 'Недостатньо прав для виконання цієї дії'
    } else if (error?.message) {
      message = error.message
    }
    
    showError('Помилка авторизації', message)
  }

  const handleFileError = (error: any, context: string = '') => {
    console.error(`File Error in ${context}:`, error)
    
    let message = 'Помилка роботи з файлом'
    
    if (error?.code === 'FILE_TOO_LARGE') {
      message = 'Файл занадто великий'
    } else if (error?.code === 'INVALID_FILE_TYPE') {
      message = 'Непідтримуваний тип файлу'
    } else if (error?.code === 'FILE_READ_ERROR') {
      message = 'Помилка читання файлу'
    } else if (error?.message) {
      message = error.message
    }
    
    showError('Помилка файлу', message)
  }

  const handleCodeExecutionError = (error: any, context: string = '') => {
    console.error(`Code Execution Error in ${context}:`, error)
    
    let message = 'Помилка виконання коду'
    
    if (error?.code === 'TIMEOUT') {
      message = 'Код виконувався занадто довго'
    } else if (error?.code === 'MEMORY_LIMIT') {
      message = 'Перевищено ліміт пам\'яті'
    } else if (error?.code === 'SYNTAX_ERROR') {
      message = 'Синтаксична помилка в коді'
    } else if (error?.code === 'RUNTIME_ERROR') {
      message = 'Помилка виконання коду'
    } else if (error?.message) {
      message = error.message
    }
    
    showError('Помилка виконання', message)
  }

  const handleUnexpectedError = (error: any, context: string = '') => {
    console.error(`Unexpected Error in ${context}:`, error)
    
    const message = 'Сталася неочікувана помилка. Спробуйте ще раз'
    showError('Помилка', message)
  }

  const createErrorBoundary = (fn: Function, context: string = '') => {
    return async (...args: any[]) => {
      try {
        return await fn(...args)
      } catch (error: any) {
        if (error?.response?.status === 401) {
          handleAuthError(error, context)
        } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
          handleApiError(error, context)
        } else if (error?.response?.status >= 500) {
          handleNetworkError(error, context)
        } else if (error?.name === 'NetworkError') {
          handleNetworkError(error, context)
        } else {
          handleUnexpectedError(error, context)
        }
        throw error
      }
    }
  }

  return {
    handleApiError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleFileError,
    handleCodeExecutionError,
    handleUnexpectedError,
    createErrorBoundary
  }
} 