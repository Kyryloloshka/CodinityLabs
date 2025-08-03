<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ authStore.isAuthenticated ? 'Вітаємо!' : 'Ласкаво просимо до системи завдань' }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ authStore.isAuthenticated 
          ? `Ви увійшли як ${getRoleLabel(authStore.user?.role)}` 
          : 'Переглядайте доступні завдання та увійдіть для подання рішень' 
        }}
      </p>
    </div>

    <!-- Публічні завдання -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ authStore.isAuthenticated ? 'Ваші завдання' : 'Публічні завдання' }}
        </h2>
        <div v-if="!authStore.isAuthenticated" class="flex space-x-3">
          <UButton
            to="/login"
            variant="solid"
            color="primary"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2 h-4 w-4" />
            Увійти для подання
          </UButton>
        </div>
      </div>

      <!-- Завантаження -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-sm text-gray-600">Завантаження завдань...</p>
        </div>
      </div>

      <!-- Помилка -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Помилка завантаження</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Список завдань -->
      <div v-else-if="assignments.length > 0" class="grid gap-6">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="px-6 py-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ assignment.title }}
                  </h3>
                  <UBadge
                    :color="getDifficultyColor(assignment.difficulty)"
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
                
                <p class="text-gray-600 mb-4 line-clamp-2">
                  {{ assignment.description }}
                </p>
                
                <div class="flex items-center gap-6 text-sm text-gray-500">
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
                <UButton
                  @click="viewAssignment(assignment)"
                  variant="ghost"
                  color="primary"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1 h-4 w-4" />
                  Переглянути
                </UButton>
                
                <UButton
                  v-if="authStore.isAuthenticated"
                  @click="submitAssignment(assignment)"
                  variant="solid"
                  color="success"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="mr-1 h-4 w-4" />
                  Здати
                </UButton>
                
                <UButton
                  v-else
                  @click="loginToSubmit(assignment)"
                  variant="solid"
                  color="primary"
                >
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-4 w-4" />
                  Увійти для подання
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Порожній стан -->
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ authStore.isAuthenticated ? 'У вас немає доступних завдань' : 'Немає публічних завдань' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
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
const { getAssignments, getTeacherAssignments } = useAssignments()

// Реактивні дані
const assignments = ref<any[]>([])
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

const getDifficultyColor = (difficulty: number) => {
  if (difficulty <= 3) return 'success'
  if (difficulty <= 6) return 'warning'
  if (difficulty <= 8) return 'warning'
  return 'error'
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

const isAssignmentActive = (assignment: any) => {
  const now = new Date()
  const deadline = new Date(assignment.deadline)
  return deadline > now
}

const viewAssignment = (assignment: any) => {
  navigateTo(`/assignments/${assignment.id}`)
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

const loadAssignments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (authStore.isAuthenticated) {
      if (authStore.user?.role === 'TEACHER') {
        assignments.value = await getTeacherAssignments(authStore.user.id)
      } else {
        assignments.value = await getAssignments()
      }
    } else {
      // Для неавторизованих користувачів показуємо публічні завдання
      assignments.value = await getAssignments()
    }
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