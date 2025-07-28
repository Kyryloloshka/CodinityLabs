<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Здати рішення</h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
              здайте ваше рішення для завдання "{{ assignment?.title }}"
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton to="/assignments" variant="ghost" color="gray">
              <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              Назад
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-sm text-gray-600">Завантаження завдання...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Помилка завантаження</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="assignment" class="max-w-4xl mx-auto space-y-6">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-xl font-semibold text-gray-900">{{ assignment.title }}</h4>
              <p class="text-gray-600 mt-2">{{ assignment.description }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-cube" class="h-5 w-5 text-gray-400" />
                <span class="text-sm text-gray-600">
                  Складність: {{ assignment.difficulty }}/10
                </span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="h-5 w-5 text-gray-400" />
                <span class="text-sm text-gray-600">
                  Дедлайн: {{ formatDate(assignment.deadline) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-gray-400" />
                <span class="text-sm text-gray-600">
                  {{ assignment.testCases.length }} тестових випадків
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Тестові випадки -->
        <div class="bg-white shadow rounded-lg p-6">
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

        <!-- Форма здавання рішення -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Ваше рішення</h2>
          
          <form @submit.prevent="submitSolution">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Код рішення
                </label>
                <UTextarea
                  v-model="submissionCode"
                  placeholder="Напишіть ваш код тут..."
                  rows="15"
                  class="font-mono w-full"
                  required
                />
                <p class="mt-2 text-sm text-gray-500">
                  Введіть ваш код, який буде протестований на наданих тестових випадках.
                </p>
              </div>
            </div>

            <!-- Кнопки дій -->
            <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <UButton
                @click="navigateTo(`/assignments/${assignmentId}`)"
                variant="ghost"
                color="gray"
              >
                <UIcon name="i-heroicons-x-mark" class="mr-2 h-4 w-4" />
                Скасувати
              </UButton>
              <UButton
                type="submit"
                variant="solid"
                color="green"
                :loading="submitting"
              >
                <UIcon name="i-heroicons-paper-airplane" class="mr-2 h-4 w-4" />
                Здати рішення
              </UButton>
            </div>
          </form>
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
const { getAssignment, createSubmission } = useAssignments()

// Реактивні дані
const assignment = ref<any>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const submissionCode = ref('')

// Отримуємо ID завдання з URL
const assignmentId = route.params.id as string

// Завантаження завдання
const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    assignment.value = await getAssignment(assignmentId)
  } catch (err) {
    error.value = 'Помилка завантаження завдання'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Здавання рішення
const submitSolution = async () => {
  if (!submissionCode.value.trim()) return

  try {
    submitting.value = true
    
    await createSubmission({
      userId: authStore.user!.id,
      assignmentId: assignmentId,
      code: submissionCode.value
    })

    // Перенаправляємо на сторінку завдання
    await navigateTo(`/assignments/${assignmentId}`)
  } catch (err) {
    console.error('Error submitting solution:', err)
  } finally {
    submitting.value = false
  }
}

// Форматування дати
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
  loadAssignment()
})
</script> 