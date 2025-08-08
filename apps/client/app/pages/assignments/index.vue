<template>
  <div class="">
    <AssignmentPageHeader 
      :title="isTeacher ? 'Мої завдання' : 'Доступні завдання'"
      :description="isTeacher ? 'Керуйте створеними вами завданнями' : 'Переглядайте та виконуйте завдання від викладачів'"
    />

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

    <div v-if="!authStore.isAuthenticated" class="mb-6">
      <UiBaseCard>
        <div class="flex">
          <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-accent-primary" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-theme-primary">Увага!</h3>
            <p class="mt-1 text-sm text-theme-secondary">
              Для подання рішень необхідно увійти в систему.
            </p>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <AssignmentFilters
      v-model="filters"
      :total-items="totalItems"
      @clear="clearFilters"
    />

    <UiLoadingSpinner 
      v-if="loading" 
      message="Завантаження завдань..." 
    />

    <UiErrorMessage 
      v-else-if="error" 
      :message="error" 
    />

    <div v-else-if="filteredAssignments.length > 0" class="grid gap-6">
      <AssignmentCard
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        :assignment="assignment"
        :is-authenticated="authStore.isAuthenticated"
        @view="() => viewAssignment(assignment)"
        @submit="() => submitAssignment(assignment)"
        @login="() => loginToSubmit(assignment)"
      />
    </div>

    <UiEmptyState
      v-else
      icon="i-heroicons-document-text"
      :title="isTeacher ? 'У вас немає створених завдань' : 'Немає доступних завдань'"
      :description="isTeacher ? 'Створіть перше завдання для студентів' : 'Зачекайте поки викладачі створять завдання'"
    >
      <template #actions>
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
      </template>
    </UiEmptyState>

    <UiPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="pageSize"
      :has-next="hasNext"
      :has-prev="hasPrev"
      @page="goToPage"
      @prev="prevPage"
      @next="nextPage"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'redirect-after-auth'
})

const authStore = useAuthStore()
const { getAssignments, getTeacherAssignments, deleteAssignment: deleteAssignmentApi } = useAssignments()

const assignments = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const currentPage = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const totalItems = ref(0)
const hasNext = ref(false)
const hasPrev = ref(false)

const filters = ref({
  searchQuery: '',
  difficultyFilter: '',
  statusFilter: ''
})

const debouncedSearchQuery = ref('')
let searchTimeout: NodeJS.Timeout | null = null

const isTeacher = computed(() => authStore.user?.role === 'TEACHER')

const filteredAssignments = computed(() => assignments.value)

const loadAssignments = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    
    const search = debouncedSearchQuery.value || undefined
    const difficulty = filters.value.difficultyFilter ? parseInt(filters.value.difficultyFilter) : undefined
    const status = filters.value.statusFilter || undefined
    
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

const viewAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}`)
}

const submitAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}/submit`)
}

const loginToSubmit = (assignment: any) => {
  if (import.meta.client) {
    sessionStorage.setItem('redirectAfterAuth', `/assignments/${assignment.id}/submit`)
  }
  navigateTo('/login')
}

const clearFilters = () => {
  filters.value.searchQuery = ''
  debouncedSearchQuery.value = ''
  filters.value.difficultyFilter = ''
  filters.value.statusFilter = ''
  loadAssignments(1)
}

watch([debouncedSearchQuery, () => filters.value.difficultyFilter, () => filters.value.statusFilter], () => {
  loadAssignments(1)
}, { deep: true })

watch(() => filters.value.searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue
  }, 500)
})

onMounted(() => {
  loadAssignments()
})

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script> 