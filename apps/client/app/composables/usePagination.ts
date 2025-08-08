import type { PaginationParams } from '~/lib/types'

export const usePagination = (initialParams: PaginationParams = {}) => {
  const currentPage = ref(initialParams.page || 1)
  const limit = ref(initialParams.limit || 10)
  const search = ref(initialParams.search || '')
  const difficulty = ref(initialParams.difficulty || undefined)
  const status = ref(initialParams.status || '')

  const updatePage = (page: number) => {
    currentPage.value = page
  }

  const updateLimit = (newLimit: number) => {
    limit.value = newLimit
    currentPage.value = 1 // Скидаємо на першу сторінку при зміні ліміту
  }

  const updateSearch = (newSearch: string) => {
    search.value = newSearch
    currentPage.value = 1 // Скидаємо на першу сторінку при зміні пошуку
  }

  const updateDifficulty = (newDifficulty: number | undefined) => {
    difficulty.value = newDifficulty
    currentPage.value = 1
  }

  const updateStatus = (newStatus: string) => {
    status.value = newStatus
    currentPage.value = 1
  }

  const resetFilters = () => {
    currentPage.value = 1
    search.value = ''
    difficulty.value = undefined
    status.value = ''
  }

  const getParams = (): PaginationParams => {
    return {
      page: currentPage.value,
      limit: limit.value,
      search: search.value || undefined,
      difficulty: difficulty.value,
      status: status.value || undefined
    }
  }

  const getQueryString = (): string => {
    const params = new URLSearchParams()
    
    if (currentPage.value > 1) {
      params.append('page', currentPage.value.toString())
    }
    if (limit.value !== 10) {
      params.append('limit', limit.value.toString())
    }
    if (search.value) {
      params.append('search', search.value)
    }
    if (difficulty.value) {
      params.append('difficulty', difficulty.value.toString())
    }
    if (status.value) {
      params.append('status', status.value)
    }
    
    return params.toString()
  }

  return {
    currentPage,
    limit,
    search,
    difficulty,
    status,
    updatePage,
    updateLimit,
    updateSearch,
    updateDifficulty,
    updateStatus,
    resetFilters,
    getParams,
    getQueryString
  }
} 