<template>
  <div class="max-w-6xl mx-auto">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
        <p class="mt-4 text-sm text-theme-secondary">Завантаження статистики...</p>
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

    <div v-else-if="assignment" class="">
      <!-- Заголовок -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-theme-primary">Статистика подань</h1>
            <h2 class="text-xl text-theme-secondary mt-2">{{ assignment.title }}</h2>
            <div class="flex items-center gap-4 mt-2 text-sm text-theme-secondary">
              <UBadge color="secondary" variant="subtle">
                Складність: {{ assignment.difficulty }}/10
              </UBadge>
              <span>Дедлайн: {{ formatDate(assignment.deadline) }}</span>
              <span>{{ statistics.totalSubmissions }} подань</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton to="/assignments" variant="ghost" color="neutral" class="text-theme-primary hover:bg-theme-hover">
              <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              Назад до завдань
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

      <!-- Загальна статистика -->
      <div class="bg-theme-card shadow rounded-lg p-6 mb-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-4">Загальна статистика</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-theme-primary">{{ statistics.totalUsers }}</div>
            <div class="text-sm text-theme-secondary">Студентів</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-theme-primary">{{ statistics.totalSubmissions }}</div>
            <div class="text-sm text-theme-secondary">Всього подань</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-success">
              {{ statistics.userStatistics.filter((stat: any) => stat.bestScore !== null).length }}
            </div>
            <div class="text-sm text-theme-secondary">Успішних студентів</div>
          </div>
          <div class="text-center p-4 bg-theme-secondary rounded-lg">
            <div class="text-2xl font-bold text-warning">
              {{ Math.round(statistics.userStatistics.reduce((acc: number, stat: any) => acc + (stat.bestScore || 0), 0) / Math.max(statistics.userStatistics.length, 1)) }}%
            </div>
            <div class="text-sm text-theme-secondary">Середній бал</div>
          </div>
        </div>
      </div>

      <!-- Список студентів -->
      <div class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
        <h2 class="text-xl font-semibold text-theme-primary mb-6">Студенти</h2>
        
        <div v-if="statistics.userStatistics.length > 0" class="space-y-4">
          <div
            v-for="userStat in statistics.userStatistics"
            :key="userStat.userId"
            class="border border-theme-primary rounded-lg p-4 bg-theme-secondary hover:bg-theme-hover transition-colors cursor-pointer"
            @click="viewUserSubmissions(userStat)"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-theme-primary rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-user" class="h-5 w-5 text-theme-card" />
                </div>
                <div>
                  <h3 class="font-medium text-theme-primary">
                    {{ userStat.user?.name || `Студент ID: ${userStat.userId}` }}
                  </h3>
                  <p class="text-sm text-theme-secondary">
                    Останнє подання: {{ formatDate(userStat.lastSubmission.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UBadge 
                  :color="getScoreColor(userStat.bestScore)" 
                  variant="subtle"
                  v-if="userStat.bestScore !== null"
                >
                  {{ userStat.bestScore }}%
                </UBadge>
                <UIcon name="i-heroicons-chevron-right" class="h-4 w-4 text-theme-muted" />
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 text-sm">
              <div class="text-center">
                <div class="font-medium text-theme-primary">{{ userStat.totalSubmissions }}</div>
                <div class="text-theme-secondary">Всього</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-success">{{ userStat.completedSubmissions }}</div>
                <div class="text-theme-secondary">Завершено</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-error">{{ userStat.failedSubmissions }}</div>
                <div class="text-theme-secondary">Помилки</div>
              </div>
              <div class="text-center">
                <div class="font-medium text-warning">{{ userStat.pendingSubmissions }}</div>
                <div class="text-theme-secondary">В обробці</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <UIcon name="i-heroicons-chart-bar" class="mx-auto h-12 w-12 text-theme-muted" />
          <h3 class="mt-2 text-sm font-medium text-theme-primary">Немає подань</h3>
          <p class="mt-1 text-sm text-theme-secondary">Студенти ще не здавали рішення для цього завдання</p>
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
const statistics = ref<any>({
  assignmentId: '',
  totalUsers: 0,
  totalSubmissions: 0,
  userStatistics: [],
})
const loading = ref(true)
const error = ref('')

const assignmentId = computed(() => route.params.id as string)

const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Перевіряємо чи користувач все ще авторизований
    if (!authStore.isAuthenticated) {
      return
    }
    
    // Завантажуємо завдання та статистику паралельно
    const [assignmentData, statisticsData] = await Promise.all([
      getAssignmentForTeacher(assignmentId.value),
      getAssignmentStatisticsWithUsers(assignmentId.value)
    ])
    
    assignment.value = assignmentData
    statistics.value = statisticsData
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
      description: 'Помилка завантаження даних',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const viewUserSubmissions = (userStat: any) => {
  navigateTo(`/assignments/${assignmentId.value}/user-submissions/${userStat.userId}`)
}

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