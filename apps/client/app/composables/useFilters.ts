import type { Ref } from 'vue'

export const useFilters = <T>(items: Ref<T[]>, filterFn: (item: T, filters: any) => boolean) => {
  const filters = ref<any>({})
  const filteredItems = computed(() => {
    return items.value.filter(item => filterFn(item, filters.value))
  })

  const setFilter = (key: string, value: any) => {
    filters.value[key] = value
  }

  const removeFilter = (key: string) => {
    delete filters.value[key]
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const hasFilters = computed(() => {
    return Object.keys(filters.value).length > 0
  })

  const getActiveFilters = computed(() => {
    return Object.entries(filters.value).filter(([_, value]) => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
  })

  return {
    filters,
    filteredItems,
    setFilter,
    removeFilter,
    clearFilters,
    hasFilters,
    getActiveFilters
  }
}

// Специфічні фільтри для завдань
export const useAssignmentFilters = (assignments: Ref<any[]>) => {
  const filterFn = (assignment: any, filters: any) => {
    // Фільтр за пошуком
    if (filters.search && filters.search.trim() !== '') {
      const search = filters.search.toLowerCase()
      const matchesSearch = 
        assignment.title.toLowerCase().includes(search) ||
        assignment.description.toLowerCase().includes(search)
      if (!matchesSearch) return false
    }

    // Фільтр за складністю
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (assignment.difficulty !== filters.difficulty) return false
    }

    // Фільтр за статусом
    if (filters.status && filters.status !== 'all') {
      const now = new Date()
      const deadline = new Date(assignment.deadline)
      const isActive = deadline > now
      
      if (filters.status === 'active' && !isActive) return false
      if (filters.status === 'expired' && isActive) return false
    }

    // Фільтр за датою створення
    if (filters.dateFrom) {
      const createdDate = new Date(assignment.createdAt)
      const fromDate = new Date(filters.dateFrom)
      if (createdDate < fromDate) return false
    }

    if (filters.dateTo) {
      const createdDate = new Date(assignment.createdAt)
      const toDate = new Date(filters.dateTo)
      if (createdDate > toDate) return false
    }

    return true
  }

  return useFilters(assignments, filterFn)
}

// Специфічні фільтри для подань
export const useSubmissionFilters = (submissions: Ref<any[]>) => {
  const filterFn = (submission: any, filters: any) => {
    // Фільтр за статусом
    if (filters.status && filters.status !== 'all') {
      if (submission.status !== filters.status) return false
    }

    // Фільтр за балом
    if (filters.minScore) {
      if (submission.score < filters.minScore) return false
    }

    if (filters.maxScore) {
      if (submission.score > filters.maxScore) return false
    }

    // Фільтр за датою подання
    if (filters.dateFrom) {
      const submittedDate = new Date(submission.createdAt)
      const fromDate = new Date(filters.dateFrom)
      if (submittedDate < fromDate) return false
    }

    if (filters.dateTo) {
      const submittedDate = new Date(submission.createdAt)
      const toDate = new Date(filters.dateTo)
      if (submittedDate > toDate) return false
    }

    return true
  }

  return useFilters(submissions, filterFn)
} 