<template>
  <div class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
    <form @submit.prevent="$emit('submit', form)">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-theme-primary mb-1">
            Назва завдання
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Введіть назву завдання"
            required
            class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-theme-primary mb-1">
            Опис завдання
          </label>
          <textarea
            v-model="form.description"
            placeholder="Опишіть завдання детально"
            rows="6"
            required
            class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0 resize-vertical"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-theme-primary mb-1">
              Складність (1-10)
            </label>
            <input
              v-model="form.difficulty"
              type="number"
              min="1"
              max="10"
              required
              class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-theme-primary mb-1">
              Дедлайн
            </label>
            <input
              v-model="form.deadline"
              type="datetime-local"
              required
              class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-theme-primary">
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
          
          <div v-if="form.testCases.length === 0" class="text-center py-8 border-2 border-dashed border-theme-secondary rounded-lg">
            <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-theme-muted" />
            <h3 class="mt-2 text-sm font-medium text-theme-primary">Немає тестових випадків</h3>
            <p class="mt-1 text-sm text-theme-secondary">Додайте тестові випадки для перевірки рішень студентів</p>
          </div>
          
          <div v-else class="grid gap-4">
            <div
              v-for="(testCase, index) in form.testCases"
              :key="index"
              class="border border-theme-primary rounded-lg p-4 bg-theme-secondary"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-theme-primary">Тест {{ index + 1 }}</h3>
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
                  <label class="block text-sm font-medium text-theme-secondary mb-1">Вхідні дані</label>
                  <input
                    v-model="testCase.input"
                    type="text"
                    placeholder="Наприклад: 5 10"
                    class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-theme-secondary mb-1">Очікуваний результат</label>
                  <input
                    v-model="testCase.expected"
                    type="text"
                    placeholder="Наприклад: 15"
                    class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-theme-secondary mb-1">Опис тесту</label>
                  <input
                    v-model="testCase.description"
                    type="text"
                    placeholder="Наприклад: Сума двох чисел"
                    class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              
              <div class="mt-4">
                <label class="flex items-center">
                  <input
                    v-model="testCase.isPublic"
                    type="checkbox"
                    class="mr-2 rounded border-theme-secondary text-primary focus:ring-primary"
                  />
                  <span class="text-sm text-theme-secondary">Публічний тест (видимий студентам)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showSettings">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-theme-primary">
              Налаштування перевірки
            </label>
            <UButton
              @click="toggleSettings"
              variant="ghost"
              color="primary"
              size="sm"
            >
              {{ showAdvancedSettings ? 'Сховати' : 'Показати' }}
            </UButton>
          </div>
          
          <div v-if="showAdvancedSettings" class="border border-theme-primary rounded-lg p-4 bg-theme-secondary">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">
                  Таймаут (мс)
                </label>
                <input
                  v-model="form.settings.timeout"
                  type="number"
                  min="200"
                  max="5000"
                  class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
                />
                <p class="text-xs text-theme-muted mt-1">Час виконання коду (200мс-5с)</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">
                  Поріг проходження (%)
                </label>
                <input
                  v-model="form.settings.passingThreshold"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0"
                />
                <p class="text-xs text-theme-muted mt-1">Мінімальний бал для проходження</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-theme-secondary mb-1">
                  Максимальна кількість подань
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="form.settings.maxAttempts"
                    type="number"
                    min="1"
                    max="100"
                    :disabled="form.settings.unlimitedAttempts"
                    class="flex-1 px-3 py-2 text-sm border border-theme-secondary rounded-md shadow-sm bg-theme-input text-theme-primary focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  <label class="flex items-center">
                    <input
                      v-model="form.settings.unlimitedAttempts"
                      type="checkbox"
                      class="mr-2 rounded border-theme-secondary text-primary focus:ring-primary"
                    />
                    <span class="text-sm text-theme-secondary">Необмежено</span>
                  </label>
                </div>
                <p class="text-xs text-theme-muted mt-1">Кількість подань для одного студента</p>
              </div>
              
              <div class="space-y-4">
                <label class="flex items-center">
                  <input
                    v-model="form.settings.allowPartialScore"
                    type="checkbox"
                    class="mr-2 rounded border-theme-secondary text-primary focus:ring-primary"
                  />
                  <span class="text-sm text-theme-secondary">Дозволити часткові бали</span>
                </label>
                
                <label class="flex items-center">
                  <input
                    v-model="form.settings.strictMode"
                    type="checkbox"
                    class="mr-2 rounded border-theme-secondary text-primary focus:ring-primary"
                  />
                  <span class="text-sm text-theme-secondary">Строгий режим (всі тести мають пройти)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-theme-primary">
        <UButton
          @click="$emit('cancel')"
          variant="ghost"
          class="text-theme-primary hover:bg-theme-hover"
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
          {{ submitButtonText }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface TestCase {
  input: string
  expected: string
  description: string
  isPublic: boolean
}

interface AssignmentSettings {
  timeout: number
  maxAttempts: number | null
  passingThreshold: number
  allowPartialScore: boolean
  strictMode: boolean
  unlimitedAttempts: boolean
}

interface AssignmentForm {
  title: string
  description: string
  difficulty: number
  deadline: string
  testCases: TestCase[]
  settings: AssignmentSettings
}

interface Props {
  modelValue: AssignmentForm
  saving?: boolean
  submitButtonText?: string
  showSettings?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignmentForm): void
  (e: 'submit', form: AssignmentForm): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  saving: false,
  submitButtonText: 'Зберегти',
  showSettings: true
})

const emit = defineEmits<Emits>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showAdvancedSettings = ref(false)

const addTestCase = () => {
  form.value.testCases.push({
    input: '',
    expected: '',
    description: '',
    isPublic: true
  })
}

const removeTestCase = (index: number) => {
  form.value.testCases.splice(index, 1)
}

const toggleSettings = () => {
  showAdvancedSettings.value = !showAdvancedSettings.value
}
</script> 