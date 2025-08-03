<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Редагувати завдання</h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
              відредагуйте вже існуюче завдання
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton to="/assignments" variant="ghost" color="neutral">
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

    <div v-else-if="assignment" class="max-w-4xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="saveAssignment">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Назва завдання
                </label>
                <UInput
                  v-model="form.title"
                  placeholder="Введіть назву завдання"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Опис завдання
                </label>
                <UTextarea
                  v-model="form.description"
                  placeholder="Опишіть завдання детально"
                  :rows="6"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Складність (1-10)
                  </label>
                  <UInput
                    v-model="form.difficulty"
                    type="number"
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Дедлайн
                  </label>
                  <UInput
                    v-model="form.deadline"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-4">
                  <label class="block text-sm font-medium text-gray-700">
                    Тестові випадки
                  </label>
                  <UButton
                    @click="addTestCase"
                    variant="ghost"
                    color="primary"
                    icon="i-heroicons-plus"
                    size="sm"
                  >
                    Додати тест
                  </UButton>
                </div>
                
                <div v-if="form.testCases.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Немає тестових випадків</h3>
                  <p class="mt-1 text-sm text-gray-500">Додайте тестові випадки для перевірки рішень студентів</p>
                </div>
                
                              <div v-else class="grid gap-4">
                <div
                  v-for="(testCase, index) in form.testCases"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-medium text-gray-900">Тест {{ index + 1 }}</h3>
                    <UButton
                      @click="removeTestCase(index)"
                      variant="ghost"
                      color="error"
                      icon="i-heroicons-trash"
                      size="sm"
                    >
                      Видалити
                    </UButton>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Вхідні дані</label>
                      <UInput
                        v-model="testCase.input"
                        placeholder="Наприклад: 5 10"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Очікуваний результат</label>
                      <UInput
                        v-model="testCase.expected"
                        placeholder="Наприклад: 15"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Опис тесту</label>
                      <UInput
                        v-model="testCase.description"
                        placeholder="Наприклад: Сума двох чисел"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

                      <!-- Кнопки дій -->
          <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <UButton
              @click="navigateTo('/assignments')"
              variant="ghost"
              color="neutral"
            >
              <UIcon name="i-heroicons-x-mark" class="mr-2 h-4 w-4" />
              Скасувати
            </UButton>
            <UButton
              type="submit"
              variant="solid"
              color="primary"
              :loading="saving"
            >
              <UIcon name="i-heroicons-check" class="mr-2 h-4 w-4" />
              Оновити завдання
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
  middleware: 'teacher-only'
})

const route = useRoute()
const authStore = useAuthStore()
const { updateAssignment, getAssignment } = useAssignments()

// Реактивні дані
const assignment = ref<any>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)

// Форма завдання
const form = ref({
  title: '',
  description: '',
  difficulty: 1,
  deadline: '',
  testCases: [] as { input: string; expected: string; description: string }[]
})

// Отримуємо ID завдання з URL
const assignmentId = route.params.id as string

// Завантаження завдання
const loadAssignment = async () => {
  try {
    loading.value = true
    error.value = ''
    assignment.value = await getAssignment(assignmentId)
    
    // Заповнюємо форму даними завдання
    form.value = {
      title: assignment.value.title,
      description: assignment.value.description,
      difficulty: assignment.value.difficulty,
      deadline: new Date(assignment.value.deadline).toISOString().slice(0, 16),
      testCases: assignment.value.testCases.map((tc: any) => ({
        input: tc.input,
        expected: tc.expected,
        description: tc.description
      }))
    }
  } catch (err) {
    error.value = 'Помилка завантаження завдання'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Методи
const addTestCase = () => {
  form.value.testCases.push({
    input: '',
    expected: '',
    description: ''
  })
}

const removeTestCase = (index: number) => {
  form.value.testCases.splice(index, 1)
}

const saveAssignment = async () => {
  try {
    saving.value = true
    error.value = ''
    
    // Валідація
    if (!form.value.title.trim()) {
      error.value = 'Назва завдання обов\'язкова'
      return
    }
    
    if (!form.value.description.trim()) {
      error.value = 'Опис завдання обов\'язковий'
      return
    }
    
    if (form.value.testCases.length === 0) {
      error.value = 'Додайте хоча б один тестовий випадок'
      return
    }
    
    // Перевіряємо, чи всі тестові випадки заповнені
    for (let i = 0; i < form.value.testCases.length; i++) {
      const testCase = form.value.testCases[i]
      if (testCase && (!testCase.input.trim() || !testCase.expected.trim() || !testCase.description.trim())) {
        error.value = `Тестовий випадок ${i + 1} має неповні дані`
        return
      }
    }
    
    const assignmentData = {
      ...form.value,
      difficulty: Number(form.value.difficulty),
      deadline: new Date(form.value.deadline).toISOString(),
      teacherId: authStore.user!.id
    }

    await updateAssignment(assignmentId, assignmentData)

    // Перенаправляємо на сторінку завдань
    await navigateTo('/assignments')
  } catch (err: any) {
    console.error('Error updating assignment:', err)
    error.value = err?.data?.message || err?.message || 'Помилка оновлення завдання'
  } finally {
    saving.value = false
  }
}

// Завантаження даних при монтуванні
onMounted(() => {
  loadAssignment()
})
</script> 