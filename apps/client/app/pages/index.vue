<template>
  <div class="">
    <!-- Заголовок -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-theme-primary">
        {{ authStore.isAuthenticated ? 'Вітаємо!' : 'Ласкаво просимо до системи завдань' }}
      </h1>
      <p class="mt-1 text-sm text-theme-secondary">
        {{ authStore.isAuthenticated 
          ? `Ви увійшли як ${getRoleLabel(authStore.user?.role)}` 
          : 'Переглядайте доступні завдання та увійдіть для подання рішень' 
        }}
      </p>
      
     
    </div>
   
    <!-- Публічні завдання -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-theme-primary">
          Публічні завдання
        </h2>
        <div v-if="!authStore.isAuthenticated" class="flex space-x-2">
          <UButton
            to="/login"
            variant="solid"
            color="primary"
            size="sm"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-3 w-3" />
            Увійти для подання
          </UButton>
        </div>
      </div>

      <!-- Завантаження -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
          <p class="mt-2 text-xs text-theme-secondary">Завантаження завдань...</p>
        </div>
      </div>

      <!-- Помилка -->
      <div v-else-if="error" class="bg-error border border-error rounded p-3">
        <div class="flex">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-error" />
          <div class="ml-2">
            <h3 class="text-xs font-medium text-error">Помилка завантаження</h3>
            <p class="mt-1 text-xs text-error-light">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Список завдань -->
      <div v-else-if="assignments.length > 0" class="grid gap-4">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          class="bg-theme-card overflow-hidden shadow rounded hover:shadow-md transition-shadow border border-theme-primary"
        >
          <div class="px-4 py-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-base font-semibold text-theme-primary">
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
                
                <p class="text-sm text-theme-secondary mb-3 line-clamp-2">
                  {{ assignment.description }}
                </p>
                
                <div class="flex items-center gap-4 text-xs text-theme-muted">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-calendar" class="mr-1 h-3 w-3" />
                    {{ formatDate(assignment.deadline) }}
                  </div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-document-text" class="mr-1 h-3 w-3" />
                    {{ assignment._count.submissions }} подань
                  </div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-cube" class="mr-1 h-3 w-3" />
                    {{ assignment.testCases.length }} тестів
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-1 ml-3">
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  size="sm"
                  class="text-theme-primary hover:bg-theme-hover"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-3 w-3" />
                  Переглянути
                </UButton>
                
                <UButton
                  v-if="authStore.isAuthenticated"
                  @click="submitAssignment(assignment)"
                  variant="ghost"
                  size="sm"
                  class="text-theme-primary hover:bg-theme-hover"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="mr-1 h-3 w-3" />
                  Здати
                </UButton>
                
                <UButton
                  v-else
                  @click="loginToSubmit(assignment)"
                  variant="solid"
                  color="primary"
                  size="sm"
                >
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-3 w-3" />
                  Увійти
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Порожній стан -->
      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-document-text" class="mx-auto h-8 w-8 text-theme-muted" />
        <h3 class="mt-2 text-sm font-medium text-theme-primary">
          {{ authStore.isAuthenticated ? 'У вас немає доступних завдань' : 'Немає публічних завдань' }}
        </h3>
        <p class="mt-1 text-xs text-theme-secondary">
          {{ authStore.isAuthenticated ? 'Зачекайте поки викладачі створять завдання' : 'Зачекайте поки викладачі створять публічні завдання' }}
        </p>
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
const { getAssignments } = useAssignments()

interface Assignment {
  id: string
  title: string
  description: string
  difficulty: number
  deadline: string
  teacherId: string
  createdAt: string
  updatedAt: string
  testCases: any[]
  _count: {
    submissions: number
  }
}

// Реактивні дані
const assignments = ref<Assignment[]>([])
const loading = ref(true)
const error = ref('')

const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'STUDENT':
      return 'Студент'
    case 'TEACHER':
      return 'Викладач'
    default:
      return 'Невідома роль'
  }
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

const isAssignmentActive = (assignment: Assignment) => {
  const now = new Date()
  const deadline = new Date(assignment.deadline)
  return deadline > now
}

const viewAssignment = (assignment: Assignment) => {
  navigateTo(`/assignments/${assignment.id}`)
}

const submitAssignment = (assignment: Assignment) => {
  navigateTo(`/assignments/${assignment.id}/submit`)
}

const loginToSubmit = (assignment: Assignment) => {
  if (import.meta.client) {
    sessionStorage.setItem('redirectAfterAuth', `/assignments/${assignment.id}/submit`)
  }
  navigateTo('/login')
}

const loadAssignments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await getAssignments(1, 10)
    assignments.value = response.data
  } catch (err) {
    error.value = 'Помилка завантаження завдань'
    console.error('Error in loadAssignments:', err)
  } finally {
    loading.value = false
  }
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignments()
})
</script> 