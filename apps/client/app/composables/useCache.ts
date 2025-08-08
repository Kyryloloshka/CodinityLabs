interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export const useCache = () => {
  const cache = new Map<string, CacheItem<any>>()

  const set = <T>(key: string, data: T, ttl: number = 5 * 60 * 1000) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  const get = <T>(key: string): T | null => {
    const item = cache.get(key)
    
    if (!item) return null
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      cache.delete(key)
      return null
    }
    
    return item.data
  }

  const has = (key: string): boolean => {
    const item = cache.get(key)
    
    if (!item) return false
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      cache.delete(key)
      return false
    }
    
    return true
  }

  const remove = (key: string) => {
    cache.delete(key)
  }

  const clear = () => {
    cache.clear()
  }

  const clearExpired = () => {
    const now = Date.now()
    for (const [key, item] of cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.delete(key)
      }
    }
  }

  const getSize = () => {
    return cache.size
  }

  const getKeys = () => {
    return Array.from(cache.keys())
  }

  return {
    set,
    get,
    has,
    remove,
    clear,
    clearExpired,
    getSize,
    getKeys
  }
}

// Специфічний кеш для завдань
export const useAssignmentCache = () => {
  const cache = useCache()
  
  const getAssignmentKey = (id: string) => `assignment_${id}`
  const getAssignmentsListKey = (params: any) => `assignments_list_${JSON.stringify(params)}`
  
  const cacheAssignment = (assignment: any) => {
    cache.set(getAssignmentKey(assignment.id), assignment, 10 * 60 * 1000) // 10 хвилин
  }
  
  const getCachedAssignment = (id: string) => {
    return cache.get(getAssignmentKey(id))
  }
  
  const cacheAssignmentsList = (assignments: any[], params: any) => {
    cache.set(getAssignmentsListKey(params), assignments, 5 * 60 * 1000) // 5 хвилин
  }
  
  const getCachedAssignmentsList = (params: any) => {
    return cache.get(getAssignmentsListKey(params))
  }
  
  const invalidateAssignment = (id: string) => {
    cache.remove(getAssignmentKey(id))
    // Видаляємо всі списки завдань, оскільки вони можуть містити оновлене завдання
    const keys = cache.getKeys()
    keys.forEach(key => {
      if (key.startsWith('assignments_list_')) {
        cache.remove(key)
      }
    })
  }
  
  return {
    cacheAssignment,
    getCachedAssignment,
    cacheAssignmentsList,
    getCachedAssignmentsList,
    invalidateAssignment
  }
}

// Специфічний кеш для подань
export const useSubmissionCache = () => {
  const cache = useCache()
  
  const getSubmissionKey = (id: string) => `submission_${id}`
  const getSubmissionsListKey = (params: any) => `submissions_list_${JSON.stringify(params)}`
  
  const cacheSubmission = (submission: any) => {
    cache.set(getSubmissionKey(submission.id), submission, 2 * 60 * 1000) // 2 хвилини
  }
  
  const getCachedSubmission = (id: string) => {
    return cache.get(getSubmissionKey(id))
  }
  
  const cacheSubmissionsList = (submissions: any[], params: any) => {
    cache.set(getSubmissionsListKey(params), submissions, 1 * 60 * 1000) // 1 хвилина
  }
  
  const getCachedSubmissionsList = (params: any) => {
    return cache.get(getSubmissionsListKey(params))
  }
  
  const invalidateSubmission = (id: string) => {
    cache.remove(getSubmissionKey(id))
    // Видаляємо всі списки подань
    const keys = cache.getKeys()
    keys.forEach(key => {
      if (key.startsWith('submissions_list_')) {
        cache.remove(key)
      }
    })
  }
  
  return {
    cacheSubmission,
    getCachedSubmission,
    cacheSubmissionsList,
    getCachedSubmissionsList,
    invalidateSubmission
  }
} 