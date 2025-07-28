<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Завантаження -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-sm text-gray-600">Завантаження завдання...</p>
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

    <!-- Контент завдання -->
    <div v-else-if="assignment" class="max-w-4xl mx-auto">
      <!-- Заголовок -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ assignment.title }}</h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <UBadge :color="getDifficultyColor(assignment.difficulty)" variant="subtle">
                Складність: {{ assignment.difficulty }}/10
              </UBadge>
              <span>Дедлайн: {{ formatDate(assignment.deadline) }}</span>
              <span>{{ assignment._count.submissions }} подань</span>
            </div>
          </div>
          
          <!-- Кнопки дій -->
          <div class="flex gap-2">
            <UButton to="/assignments" variant="ghost" color="gray">
              <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              Назад
            </UButton>
            
            <template v-if="!isTeacher">
              <UButton
                @click="navigateTo(`/assignments/${assignmentId}/submit`)"
                variant="solid"
                color="green"
              >
                <UIcon name="i-heroicons-paper-airplane" class="mr-2 h-4 w-4" />
                Здати рішення
              </UButton>
            </template>
            
            <template v-else>
              <UButton
                @click="editAssignment"
                variant="solid"
                color="yellow"
              >
                <UIcon name="i-heroicons-pencil" class="mr-2 h-4 w-4" />
                Редагувати
              </UButton>
            </template>
          </div>
        </div>
      </div>

      <!-- Опис завдання -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Опис завдання</h2>
        <div class="prose max-w-none">
          <p class="text-gray-700 whitespace-pre-wrap">{{ assignment.description }}</p>
        </div>
      </div>

      <!-- Тестові випадки -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Тестові випадки</h2>
        <div class="grid gap-4">
          <div
            v-for="(testCase, index) in assignment.testCases"
            :key="testCase.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">Тест {{ index + 1 }}</h3>
              <UBadge color="blue" variant="subtle">Тестовий випадок</UBadge>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Вхідні дані</label>
                <div class="bg-gray-50 p-2 rounded border font-mono">{{ testCase.input }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Очікуваний результат</label>
                <div class="bg-gray-50 p-2 rounded border font-mono">{{ testCase.expected }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Опис</label>
                <div class="bg-gray-50 p-2 rounded border">{{ testCase.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Подання студентів (тільки для викладачів) -->
      <div v-if="isTeacher" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Подання студентів</h2>
        
        <div v-if="submissionsLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Завантаження подань...</p>
        </div>
        
        <div v-else-if="submissions.length > 0" class="space-y-4">
          <div
            v-for="submission in submissions"
            :key="submission.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-user" class="h-4 w-4 text-gray-400" />
                <span class="font-medium">Студент ID: {{ submission.userId }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge :color="getStatusColor(submission.status)" variant="subtle">
                  {{ getStatusLabel(submission.status) }}
                </UBadge>
                <span class="text-sm text-gray-500">{{ formatDate(submission.createdAt) }}</span>
              </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded border font-mono text-sm overflow-x-auto">
              <pre>{{ submission.code }}</pre>
            </div>
            
            <div v-if="submission.score !== null" class="mt-2">
              <span class="text-sm font-medium">Оцінка: {{ submission.score }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Немає подань</h3>
          <p class="mt-1 text-sm text-gray-500">Студенти ще не здавали рішення для цього завдання</p>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const { getAssignment, getAssignmentSubmissions } = useAssignments()

// Реактивні дані
const assignment = ref<any>(null)
const submissions = ref<any[]>([])
const loading = ref(true)
const submissionsLoading = ref(false)
const error = ref('')

// Обчислювані властивості
const isTeacher = computed(() => authStore.user?.role === 'TEACHER')
const assignmentId = computed(() => route.params.id as string)

// Методи
const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    assignment.value = await getAssignment(assignmentId.value)
  } catch (err) {
    error.value = 'Помилка завантаження завдання'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadSubmissions = async () => {
  if (!isTeacher.value) return
  
  try {
    submissionsLoading.value = true
    submissions.value = await getAssignmentSubmissions(assignmentId.value)
  } catch (err) {
    console.error('Error loading submissions:', err)
  } finally {
    submissionsLoading.value = false
  }
}

const getDifficultyColor = (difficulty: number) => {
  if (difficulty <= 3) return 'green'
  if (difficulty <= 6) return 'yellow'
  if (difficulty <= 8) return 'orange'
  return 'red'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'gray'
    case 'PROCESSING': return 'yellow'
    case 'COMPLETED': return 'green'
    case 'FAILED': return 'red'
    default: return 'gray'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Очікує'
    case 'PROCESSING': return 'Обробляється'
    case 'COMPLETED': return 'Завершено'
    case 'FAILED': return 'Помилка'
    default: return 'Невідомо'
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

const editAssignment = () => {
      navigateTo(`/assignments/${assignmentId.value}/edit`)
}



// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignment()
  loadSubmissions()
})
</script> 