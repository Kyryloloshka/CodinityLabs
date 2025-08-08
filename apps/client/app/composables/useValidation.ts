export const useValidation = () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Пароль має бути не менше 8 символів')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль має містити хоча б одну велику літеру')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль має містити хоча б одну малу літеру')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Пароль має містити хоча б одну цифру')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validateRequired = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
    if (!value || value.trim().length === 0) {
      return {
        isValid: false,
        error: `${fieldName} є обов'язковим полем`
      }
    }
    return { isValid: true }
  }

  const validateMinLength = (value: string, minLength: number, fieldName: string): { isValid: boolean; error?: string } => {
    if (value.length < minLength) {
      return {
        isValid: false,
        error: `${fieldName} має бути не менше ${minLength} символів`
      }
    }
    return { isValid: true }
  }

  const validateMaxLength = (value: string, maxLength: number, fieldName: string): { isValid: boolean; error?: string } => {
    if (value.length > maxLength) {
      return {
        isValid: false,
        error: `${fieldName} має бути не більше ${maxLength} символів`
      }
    }
    return { isValid: true }
  }

  const validateNumber = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
    const num = Number(value)
    if (isNaN(num)) {
      return {
        isValid: false,
        error: `${fieldName} має бути числом`
      }
    }
    return { isValid: true }
  }

  const validateNumberRange = (value: string, min: number, max: number, fieldName: string): { isValid: boolean; error?: string } => {
    const num = Number(value)
    if (isNaN(num)) {
      return {
        isValid: false,
        error: `${fieldName} має бути числом`
      }
    }
    if (num < min || num > max) {
      return {
        isValid: false,
        error: `${fieldName} має бути в діапазоні від ${min} до ${max}`
      }
    }
    return { isValid: true }
  }

  const validateDate = (dateString: string, fieldName: string): { isValid: boolean; error?: string } => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: `${fieldName} має бути правильною датою`
      }
    }
    return { isValid: true }
  }

  const validateFutureDate = (dateString: string, fieldName: string): { isValid: boolean; error?: string } => {
    const date = new Date(dateString)
    const now = new Date()
    if (date <= now) {
      return {
        isValid: false,
        error: `${fieldName} має бути в майбутньому`
      }
    }
    return { isValid: true }
  }

  return {
    validateEmail,
    validatePassword,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateNumber,
    validateNumberRange,
    validateDate,
    validateFutureDate
  }
} 