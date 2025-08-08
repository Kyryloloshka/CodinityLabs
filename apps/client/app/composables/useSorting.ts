import type { Ref } from 'vue'

export interface SortOption {
  key: string
  label: string
  direction: 'asc' | 'desc'
}

export const useSorting = <T>(items: Ref<T[]>) => {
  const sortBy = ref<string>('')
  const sortDirection = ref<'asc' | 'desc'>('asc')

  const sortedItems = computed(() => {
    if (!sortBy.value) return items.value

    return [...items.value].sort((a, b) => {
      const aValue = getNestedValue(a, sortBy.value)
      const bValue = getNestedValue(b, sortBy.value)

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      let comparison = 0

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'uk')
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else {
        comparison = String(aValue).localeCompare(String(bValue), 'uk')
      }

      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  })

  const setSort = (key: string, direction: 'asc' | 'desc' = 'asc') => {
    if (sortBy.value === key && sortDirection.value === direction) {
      // Якщо натиснули на ту саму колонку, змінюємо напрямок
      sortDirection.value = direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = key
      sortDirection.value = direction
    }
  }

  const clearSort = () => {
    sortBy.value = ''
    sortDirection.value = 'asc'
  }

  const getSortIcon = (key: string) => {
    if (sortBy.value !== key) return 'i-heroicons-arrows-up-down'
    return sortDirection.value === 'asc' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'
  }

  const getSortLabel = (key: string) => {
    if (sortBy.value !== key) return ''
    return sortDirection.value === 'asc' ? 'За зростанням' : 'За спаданням'
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  return {
    sortBy,
    sortDirection,
    sortedItems,
    setSort,
    clearSort,
    getSortIcon,
    getSortLabel
  }
}

// Специфічне сортування для завдань
export const useAssignmentSorting = (assignments: Ref<any[]>) => {
  const { sortedItems, setSort, clearSort, getSortIcon, getSortLabel } = useSorting(assignments)

  const sortOptions = [
    { key: 'title', label: 'Назва' },
    { key: 'difficulty', label: 'Складність' },
    { key: 'deadline', label: 'Дедлайн' },
    { key: 'createdAt', label: 'Дата створення' },
    { key: '_count.submissions', label: 'Кількість подань' }
  ]

  return {
    sortedItems,
    setSort,
    clearSort,
    getSortIcon,
    getSortLabel,
    sortOptions
  }
}

// Специфічне сортування для подань
export const useSubmissionSorting = (submissions: Ref<any[]>) => {
  const { sortedItems, setSort, clearSort, getSortIcon, getSortLabel } = useSorting(submissions)

  const sortOptions = [
    { key: 'createdAt', label: 'Дата подання' },
    { key: 'score', label: 'Бал' },
    { key: 'status', label: 'Статус' },
    { key: 'assignment.title', label: 'Назва завдання' }
  ]

  return {
    sortedItems,
    setSort,
    clearSort,
    getSortIcon,
    getSortLabel,
    sortOptions
  }
} 