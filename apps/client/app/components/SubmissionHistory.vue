<template>
  <div class="w-full h-full bg-theme-card overflow-y-auto transition-colors duration-300">
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-theme-primary">Історія подань</h3>
        <button
          @click="$emit('refresh')"
          class="flex items-center gap-1 px-2 py-1 text-xs text-theme-secondary hover:text-theme-primary transition-colors"
          :disabled="loading"
        >
          <UIcon name="i-heroicons-arrow-path" class="h-3 w-3" :class="{ 'animate-spin': loading }" />
          Оновити
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 text-theme-muted mx-auto mb-2 animate-spin" />
        <p class="text-theme-secondary text-sm">Завантаження історії...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-700 dark:text-red-400 mx-auto mb-2" />
        <p class="text-red-700 dark:text-red-400 text-sm">{{ error }}</p>
        <button
          @click="$emit('refresh')"
          class="mt-2 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded transition-colors"
        >
          Спробувати знову
        </button>
      </div>

      <div v-else-if="submissions.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-theme-muted mx-auto mb-2" />
        <p class="text-theme-secondary text-sm">Історія подань порожня</p>
      </div>

      <div v-else class="space-y-2">
        <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-xs text-blue-800 dark:text-blue-300">
          <UIcon name="i-heroicons-information-circle" class="h-3 w-3 inline mr-1" />
          При перегляді історії показуються тільки публічні тестові випадки
        </div>
        
        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="p-3 border border-theme-secondary rounded-lg hover:bg-theme-secondary/20 transition-colors cursor-pointer"
          @click="$emit('select-submission', submission)"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-theme-secondary">
                {{ formatDate(submission.createdAt) }}
              </span>
              <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(submission.status)">
                {{ getStatusText(submission.status) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-theme-primary">
                {{ submission.score !== null ? `${submission.score}%` : '—' }}
              </span>
              <UIcon name="i-heroicons-chevron-right" class="h-3 w-3 text-theme-secondary" />
            </div>
          </div>
          
          <div class="flex items-center gap-2 text-xs text-theme-secondary">
            <UIcon name="i-heroicons-code-bracket" class="h-3 w-3" />
            <span>{{ submission.language || 'javascript' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Submission {
  id: string
  userId: string
  assignmentId: string
  code: string
  language?: string
  eslintReport: any
  testResults: any
  score: number | null
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
  assignment: any
}

interface Props {
  submissions: Submission[]
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'refresh'): void
  (e: 'select-submission', submission: Submission): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'FAILED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'PROCESSING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'PENDING':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Завершено'
    case 'FAILED':
      return 'Помилка'
    case 'PROCESSING':
      return 'Обробка'
    case 'PENDING':
      return 'Очікування'
    default:
      return status
  }
}
</script> 