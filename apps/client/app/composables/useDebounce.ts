import { ref, watch } from 'vue'

export const useDebounce = <T>(value: Ref<T>, delay: number = 300) => {
  const debouncedValue = ref<T>(value.value)

  let timeoutId: NodeJS.Timeout | null = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

export const useDebouncedFunction = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise<ReturnType<T>>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    })
  }) as (...args: Parameters<T>) => Promise<ReturnType<T>>
}

export const useThrottle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) => {
  let lastCall = 0

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      return fn(...args)
    }
  }) as (...args: Parameters<T>) => ReturnType<T> | undefined
}

export const useThrottledRef = <T>(value: Ref<T>, delay: number = 300) => {
  const throttledValue = ref<T>(value.value)
  let lastUpdate = 0

  watch(value, (newValue) => {
    const now = Date.now()
    
    if (now - lastUpdate >= delay) {
      lastUpdate = now
      throttledValue.value = newValue
    }
  })

  return throttledValue
} 