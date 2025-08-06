<template>
  <div class="">
    <!-- Заголовок сторінки -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-theme-primary">
        {{ isTeacher ? 'Мої завдання' : 'Доступні завдання' }}
      </h1>
      <p class="mt-2 text-theme-secondary">
        {{ isTeacher ? 'Керуйте створеними вами завданнями' : 'Переглядайте та виконуйте завдання від викладачів' }}
      </p>
    </div>

    <!-- Кнопка створення завдання для викладачів -->
    <div v-if="isTeacher" class="mb-6">
      <UButton
        @click="navigateTo('/assignments/create')"
        variant="solid"
        color="primary"
      >
        <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
        Створити завдання
      </UButton>
    </div>

    <!-- Інформація для неавторизованих користувачів -->
    <div v-if="!authStore.isAuthenticated" class="mb-6">
      <div class="bg-theme-secondary border border-theme-primary rounded-lg p-4">
        <div class="flex">
          <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-accent-primary" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-theme-primary">Увага!</h3>
            <p class="mt-1 text-sm text-theme-secondary">
              Для подання рішень необхідно увійти в систему.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фільтри та пошук -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          placeholder="Пошук завдань..."
          icon="i-heroicons-magnifying-glass"
          class="min-w-64 px-2 text-sm py-1 h-8 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
        />
      </div>
      <div class="flex gap-2">
        <UButton
          v-if="hasActiveFilters"
          @click="clearFilters"
          variant="ghost"
          color="neutral"
          class="self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0 h-8 w-8 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-x-mark" class="h-4 w-4 text-theme-primary" />
        </UButton>
        <select
          v-model="difficultyFilter"
          class="w-40 py-1 flex items-center h-8 self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
        >
          <option value="">Всі складності</option>
          <option value="1">Складність 1</option>
          <option value="2">Складність 2</option>
          <option value="3">Складність 3</option>
          <option value="4">Складність 4</option>
          <option value="5">Складність 5</option>
          <option value="6">Складність 6</option>
          <option value="7">Складність 7</option>
          <option value="8">Складність 8</option>
          <option value="9">Складність 9</option>
          <option value="10">Складність 10</option>
        </select>
        <select
          v-model="statusFilter"
          class="w-40 py-1 flex items-center h-8 self-start text-sm px-2 border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
        >
          <option value="">Всі статуси</option>
          <option value="active">Активні</option>
          <option value="completed">Завершені</option>
        </select>
      </div>
    </div>

    <!-- Індикатор результатів -->
    <div v-if="hasActiveFilters" class="mb-4 text-sm text-theme-secondary">
      Знайдено {{ totalItems }} завдань
    </div>

    <!-- Завантаження -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
        <p class="mt-4 text-sm text-theme-secondary">Завантаження завдань...</p>
      </div>
    </div>

    <!-- Помилка -->
    <div v-else-if="error" class="bg-error border border-error rounded-lg p-4">
      <div class="flex">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-error">Помилка завантаження</h3>
          <p class="mt-1 text-sm text-error-light">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Список завдань -->
    <div v-else-if="filteredAssignments.length > 0" class="grid gap-6">
      <div
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        class="bg-theme-card overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-theme-primary"
      >
        <div class="px-6 py-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-theme-primary">
                  {{ assignment.title }}
                </h3>
                <UBadge
                  color="secondary"
                  variant="subtle"
                >
                  Складність: {{ assignment.difficulty }}/10
                </UBadge>
                <UBadge
                  :color="isAssignmentActive(assignment) ? 'success' : 'error'"
                  variant="subtle"
                >
                  {{ isAssignmentActive(assignment) ? 'Активне' : 'Завершене' }}
                </UBadge>
              </div>
              
              <p class="text-theme-secondary mb-4 line-clamp-2">
                {{ assignment.description }}
              </p>
              
              <div class="flex items-center gap-6 text-sm text-theme-muted">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="mr-1 h-4 w-4" />
                  Дедлайн: {{ formatDate(assignment.deadline) }}
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="mr-1 h-4 w-4" />
                  {{ assignment._count.submissions }} подань
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-cube" class="mr-1 h-4 w-4" />
                  {{ assignment.testCases.length }} тестів
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <!-- Для студентів -->
              <template v-if="!isTeacher && authStore.isAuthenticated">
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  color="primary"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                <UButton
                  @click="submitAssignment(assignment)"
                  variant="solid"
                  color="success"
                  class="text-theme-primary"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="mr-1 h-4 w-4" />
                  Здати
                </UButton>
              </template>
              
              <!-- Для неавторизованих користувачів -->
              <template v-if="!authStore.isAuthenticated">
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  color="primary"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                <UButton
                  @click="loginToSubmit(assignment)"
                  variant="solid"
                  color="primary"
                >
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-4 w-4" />
                  Увійти для подання
                </UButton>
              </template>
              
              <!-- Для викладачів -->
              <div class="flex items-end flex-col gap-2" v-if="isTeacher">
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  class="text-theme-primary hover:bg-theme-hover"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                <UButton
                  @click="editAssignment(assignment)"
                  variant="ghost"
                  class="text-theme-primary hover:bg-theme-hover"
                >
                  <UIcon name="i-heroicons-pencil" class="mr-1 h-4 w-4" />
                  Редагувати
                </UButton>
                <UButton
                  @click="deleteAssignment(assignment)"
                  variant="ghost"
                  color="error"
                >
                  <UIcon name="i-heroicons-trash" class="mr-1 h-4 w-4" />
                  Видалити
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Порожній стан -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-theme-muted" />
      <h3 class="mt-2 text-sm font-medium text-theme-primary">
        {{ isTeacher ? 'У вас немає створених завдань' : 'Немає доступних завдань' }}
      </h3>
      <p class="mt-1 text-sm text-theme-secondary">
        {{ isTeacher ? 'Створіть перше завдання для студентів' : 'Зачекайте поки викладачі створять завдання' }}
      </p>
      <div v-if="isTeacher" class="mt-6">
        <UButton
          @click="navigateTo('/assignments/create')"
          variant="solid"
          color="primary"
        >
          <UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
          Створити завдання
        </UButton>
      </div>
    </div>

    <!-- Пагінація -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-theme-secondary">
        Показано {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalItems) }} з {{ totalItems }} завдань
      </div>
      
      <div class="flex items-center gap-2">
        <UButton
          @click="prevPage"
          :disabled="!hasPrev"
          variant="ghost"
          size="sm"
        >
          <UIcon name="i-heroicons-chevron-left" class="h-4 w-4" />
          Попередня
        </UButton>
        
        <div class="flex items-center gap-1">
          <UButton
            v-for="page in getVisiblePages()"
            :key="page"
            @click="goToPage(page)"
            :variant="page === currentPage ? 'solid' : 'ghost'"
            color="primary"
            size="sm"
            class="w-8 h-8 hover:bg-theme-hover flex items-center justify-center"
          >
            {{ page }}
          </UButton>
        </div>
        
        <UButton
          @click="nextPage"
          :disabled="!hasNext"
          variant="ghost"
          size="sm"
        >
          Наступна
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'redirect-after-auth'
})

const authStore = useAuthStore()
const { getAssignments, getTeacherAssignments, deleteAssignment: deleteAssignmentApi } = useAssignments()

// Реактивні дані
const assignments = ref<any[]>([])
const loading = ref(true)
const error = ref('')

// Пагінація
const currentPage = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const totalItems = ref(0)
const hasNext = ref(false)
const hasPrev = ref(false)

// Фільтри
const searchQuery = ref('')
const difficultyFilter = ref('')
const statusFilter = ref('')

// Дебаунс для пошуку
const debouncedSearchQuery = ref('')
let searchTimeout: NodeJS.Timeout | null = null

// Обчислювані властивості
const isTeacher = computed(() => authStore.user?.role === 'TEACHER')

// Використовуємо assignments напряму, оскільки фільтрація тепер на сервері
const filteredAssignments = computed(() => assignments.value)

const loadAssignments = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    
    // Prepare filter parameters
    const search = debouncedSearchQuery.value || undefined
    const difficulty = difficultyFilter.value ? parseInt(difficultyFilter.value) : undefined
    const status = statusFilter.value || undefined
    
    if (authStore.isAuthenticated) {
      if (isTeacher.value) {
        const response = await getTeacherAssignments(authStore.user!.id, page, pageSize.value, search, difficulty, status)
        assignments.value = response.data
        totalPages.value = response.meta.totalPages
        totalItems.value = response.meta.total
        hasNext.value = response.meta.hasNext
        hasPrev.value = response.meta.hasPrev
        currentPage.value = response.meta.page
      } else {
        const response = await getAssignments(page, pageSize.value, search, difficulty, status)
        assignments.value = response.data
        totalPages.value = response.meta.totalPages
        totalItems.value = response.meta.total
        hasNext.value = response.meta.hasNext
        hasPrev.value = response.meta.hasPrev
        currentPage.value = response.meta.page
      }
    } else {
      const response = await getAssignments(page, pageSize.value, search, difficulty, status)
      assignments.value = response.data
      totalPages.value = response.meta.totalPages
      totalItems.value = response.meta.total
      hasNext.value = response.meta.hasNext
      hasPrev.value = response.meta.hasPrev
      currentPage.value = response.meta.page
    }
  } catch (err) {
    error.value = 'Помилка завантаження завдань'
    console.error('Error in loadAssignments:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    loadAssignments(page)
  }
}

const nextPage = () => {
  if (hasNext.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (hasPrev.value) {
    goToPage(currentPage.value - 1)
  }
}

const getVisiblePages = () => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}`)
}

const editAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}/edit`)
}

const deleteAssignment = async (assignment: any) => {
  if (!confirm('Ви впевнені, що хочете видалити це завдання?')) return

  try {
    await deleteAssignmentApi(assignment.id)
    await loadAssignments()
  } catch (err) {
    console.error('Error deleting assignment:', err)
  }
}

const submitAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}/submit`)
}

const loginToSubmit = (assignment: any) => {
  // Зберігаємо сторінку для редіректу після авторизації
  if (import.meta.client) {
    sessionStorage.setItem('redirectAfterAuth', `/assignments/${assignment.id}/submit`)
  }
  navigateTo('/login')
}

const isAssignmentActive = (assignment: any) => {
  const now = new Date()
  const deadline = new Date(assignment.deadline)
  return deadline > now
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || difficultyFilter.value || statusFilter.value
})

const clearFilters = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  difficultyFilter.value = ''
  statusFilter.value = ''
  loadAssignments(1) // Reset to first page when clearing filters
}

// Watch for filter changes and reload data
watch([debouncedSearchQuery, difficultyFilter, statusFilter], () => {
  loadAssignments(1) // Reset to first page when filters change
}, { deep: true })

// Дебаунс для пошуку
watch(searchQuery, (newValue) => {
  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Set new timeout
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue
  }, 500)
})

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignments()
})

onUnmounted(() => {
  // Clean up timeout to prevent memory leaks
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script> 