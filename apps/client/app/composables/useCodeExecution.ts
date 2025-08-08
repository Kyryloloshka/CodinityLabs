import type { CheckCodeRequest, CheckCodeResponse } from '~/lib/types'

export const useCodeExecution = () => {
  const { checkCode } = useAssignments()
  const { showSuccess, showError, showLoading, updateLoading } = useNotifications()

  const executeCode = async (
    code: string, 
    language: string, 
    assignmentId?: string,
    testCases?: any[]
  ): Promise<CheckCodeResponse | null> => {
    const loadingId = showLoading('Перевірка коду', 'Виконується аналіз та тестування...')

    try {
      const request: CheckCodeRequest = {
        code,
        language,
        assignmentId,
        testCases
      }

      const response = await checkCode(request)
      
      updateLoading(loadingId, 'Код перевірено', 'Результати готові', true)
      
      return response
    } catch (error: any) {
      const errorMessage = error?.message || 'Помилка виконання коду'
      updateLoading(loadingId, 'Помилка', errorMessage, false)
      
      console.error('Error executing code:', error)
      return null
    }
  }

  const validateCode = (code: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (!code || code.trim().length === 0) {
      errors.push('Код не може бути порожнім')
    }
    
    if (code.length > 10000) {
      errors.push('Код занадто довгий (максимум 10000 символів)')
    }
    
    // Перевірка на небезпечні конструкції
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /document\./,
      /window\./,
      /process\./,
      /require\s*\(/,
      /import\s*\(/,
      /fetch\s*\(/,
      /XMLHttpRequest/,
      /fetch\s*\(/
    ]
    
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        errors.push('Код містить небезпечні конструкції')
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const formatCode = (code: string, language: string): string => {
    // Базова форматування коду
    let formattedCode = code.trim()
    
    // Видалення зайвих пробілів на початку та кінці
    formattedCode = formattedCode.replace(/^\s+|\s+$/g, '')
    
    // Видалення порожніх рядків на початку та кінці
    formattedCode = formattedCode.replace(/^\n+|\n+$/g, '')
    
    return formattedCode
  }

  const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
        return 'javascript'
      case 'ts':
        return 'typescript'
      case 'py':
        return 'python'
      case 'java':
        return 'java'
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp'
      case 'c':
        return 'c'
      default:
        return 'javascript'
    }
  }

  const getLanguageDisplayName = (language: string): string => {
    switch (language) {
      case 'javascript':
        return 'JavaScript'
      case 'typescript':
        return 'TypeScript'
      case 'python':
        return 'Python'
      case 'java':
        return 'Java'
      case 'cpp':
        return 'C++'
      case 'c':
        return 'C'
      default:
        return language
    }
  }

  return {
    executeCode,
    validateCode,
    formatCode,
    getLanguageFromExtension,
    getLanguageDisplayName
  }
} 