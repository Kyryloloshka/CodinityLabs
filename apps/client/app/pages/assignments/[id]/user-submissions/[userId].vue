<template>
  <div class="max-w-6xl mx-auto">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
        <p class="mt-4 text-sm text-theme-secondary">Завантаження подань...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-error border border-error rounded-lg p-4">
      <div class="flex">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-error">Помилка завантаження</h3>
          <p class="mt-1 text-sm text-error-light">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="assignment && userStat" class="">
      <!-- Заголовок -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-theme-primary">Подання студента</h1>
            <h2 class="text-xl text-theme-secondary mt-2">{{ assignment.title }}</h2>
            <div class="flex items-center gap-4 mt-2 text-sm text-theme-secondary">
              <span class="font-medium">{{ userStat.user?.name || `Студент ID: ${userStat.userId}` }}</span>
              <UBadge color="secondary" variant="subtle">
                {{ userStat.totalSubmissions }} подань
              </UBadge>
              <UBadge 
                v-if="userStat.bestScore !== null"
                :color="getScoreColor(userStat.bestScore)" 
                variant="subtle"
              >
                Найкращий бал: {{ userStat.bestScore }}%
              </UBadge>
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton 
              :to="`/assignments/${assignmentId}/user-submissions`" 
              variant="ghost" 
              color="neutral" 
              class="text-theme-primary hover:bg-theme-hover"
            >
              <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              Назад до статистики
            </UButton>
            
            <UButton 
              :to="`/assignments/${assignmentId}`" 
              variant="ghost" 
              color="primary" 
              class="text-theme-primary hover:bg-theme-hover"
            >
              <UIcon name="i-heroicons-eye" class="mr-2 h-4 w-4" />
              Переглянути завдання
            </UButton>
          </div>
        </div>
      </div>

      <!-- Статистика користувача -->
      <div class="bg-theme-card shadow rounded-lg p-6 mb-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-4">Статистика студента</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-theme-primary">{{ userStat.totalSubmissions }}</div>
            <div class="text-sm text-theme-secondary">Всього подань</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-success">{{ userStat.completedSubmissions }}</div>
            <div class="text-sm text-theme-secondary">Завершено</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-error">{{ userStat.failedSubmissions }}</div>
            <div class="text-sm text-theme-secondary">Помилки</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-warning">{{ userStat.pendingSubmissions }}</div>
            <div class="text-sm text-theme-secondary">В обробці</div>
          </div>
        </div>
      </div>

      <!-- Список подань -->
      <div class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-6">Всі подання</h2>
        
        <div v-if="userStat.submissions.length > 0" class="space-y-6">
          <div
            v-for="submission in userStat.submissions"
            :key="submission.id"
            class="border border-theme-primary rounded-lg p-4 bg-theme-secondary"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <UBadge :color="getStatusColor(submission.status)" variant="subtle">
                  {{ getStatusLabel(submission.status) }}
                </UBadge>
                <span class="text-sm text-theme-secondary">{{ formatDate(submission.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge 
                  v-if="submission.score !== null"
                  :color="getScoreColor(submission.score)" 
                  variant="subtle"
                >
                  {{ submission.score }}%
                </UBadge>
                <span v-if="submission.language" class="text-xs text-theme-secondary">
                  {{ submission.language }}
                </span>
              </div>
            </div>

            <!-- Код -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-theme-primary mb-2">Код:</h4>
              <div class="bg-theme-input p-3 rounded border border-theme-primary font-mono text-sm overflow-x-auto text-theme-primary">
                <pre>{{ submission.code }}</pre>
              </div>
            </div>

            <!-- Результати тестів -->
            <div v-if="submission.testResults && Array.isArray(submission.testResults)">
              <h4 class="text-sm font-medium text-theme-primary mb-2">Результати тестів:</h4>
              <div class="grid gap-2">
                <div
                  v-for="(testResult, index) in submission.testResults"
                  :key="index"
                  class="border border-theme-primary rounded p-3"
                  :class="testResult.passed ? 'bg-success/10' : 'bg-error/10'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <UIcon 
                        :name="testResult.passed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                        :class="testResult.passed ? 'text-success' : 'text-error'"
                        class="h-4 w-4"
                      />
                      <span class="text-sm font-medium text-theme-primary">
                        Тест {{ index + 1 }}
                        <UBadge 
                          v-if="!testResult.isPublic" 
                          color="warning" 
                          variant="subtle" 
                          class="ml-2"
                        >
                          Приватний
                        </UBadge>
                      </span>
                    </div>
                    <span class="text-xs text-theme-secondary">{{ testResult.description }}</span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span class="text-theme-secondary">Вхід:</span>
                      <div class="font-mono bg-theme-input p-1 rounded">{{ testResult.input }}</div>
                    </div>
                    <div>
                      <span class="text-theme-secondary">Очікувано:</span>
                      <div class="font-mono bg-theme-input p-1 rounded">{{ testResult.expected }}</div>
                    </div>
                    <div>
                      <span class="text-theme-secondary">Отримано:</span>
                      <div class="font-mono bg-theme-input p-1 rounded">{{ testResult.actual || testResult.output }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-theme-muted" />
          <h3 class="mt-2 text-sm font-medium text-theme-primary">Немає подань</h3>
          <p class="mt-1 text-sm text-theme-secondary">Студент ще не здавав рішення для цього завдання</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['redirect-after-auth', 'teacher-only']
})

const route = useRoute()
const authStore = useAuthStore()
const { getAssignmentForTeacher, getAssignmentStatisticsWithUsers } = useAssignments()
const toast = useToast()

const assignment = ref<any>(null)
const userStat = ref<any>(null)
const loading = ref(true)
const error = ref('')

const assignmentId = computed(() => route.params.id as string)
const userId = computed(() => route.params.userId as string)

const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Перевіряємо чи користувач все ще авторизований
    if (!authStore.isAuthenticated) {
      return
    }
    
    if (!userId.value) {
      throw new Error('Не вказано користувача')
    }
    
    // Завантажуємо завдання та статистику паралельно
    const [assignmentData, statisticsData] = await Promise.all([
      getAssignmentForTeacher(assignmentId.value),
      getAssignmentStatisticsWithUsers(assignmentId.value)
    ])
    
    assignment.value = assignmentData
    
    // Знаходимо статистику конкретного користувача
    const userStatistics = statisticsData.userStatistics.find((stat: any) => stat.userId === userId.value)
    if (!userStatistics) {
      throw new Error('Користувача не знайдено')
    }
    
    userStat.value = userStatistics
  } catch (err: any) {
    console.error('Load data error:', err)
    
    // Перевіряємо чи користувач все ще авторизований
    if (!authStore.isAuthenticated) {
      return
    }
    
    // Перевіряємо чи це помилка авторизації або скасування
    if (err?.status === 401 || err?.statusCode === 401 || err?.message === 'AUTH_CANCELLED') {
      // Middleware обробить це автоматично, не показуємо помилку
      return
    }
    
    if (err?.status === 404 || err?.statusCode === 404) {
      error.value = 'Помилка завантаження даних'
      toast.add({
        title: 'Помилка',
        description: 'Таке завдання не доступне',
        color: 'error'
      })
      setTimeout(async () => {
        await navigateTo('/assignments')
      }, 2000)
      return
    }
    
    // Показуємо помилку тільки якщо це не помилка авторизації
    error.value = 'Помилка завантаження даних'
    toast.add({
      title: 'Помилка',
      description: err.message || 'Помилка завантаження даних',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'info';
    case 'PROCESSING': return 'warning';
    case 'COMPLETED': return 'success';
    case 'FAILED': return 'error';
    default: return 'neutral';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Очікує';
    case 'PROCESSING': return 'Обробляється';
    case 'COMPLETED': return 'Завершено';
    case 'FAILED': return 'Помилка';
    default: return 'Невідомо';
  }
};

const getScoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return 'neutral';
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadData()
})
</script> 