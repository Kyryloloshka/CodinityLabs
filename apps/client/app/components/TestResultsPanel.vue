<template>
  <div v-if="checkResults" class="space-y-3">
    <!-- Score -->
    <div class="flex items-center justify-between p-2 bg-theme-secondary rounded">
      <span class="text-xs font-medium text-theme-primary">Загальний результат:</span>
      <UBadge 
        :color="checkResults.score >= 70 ? 'success' : checkResults.score >= 40 ? 'neutral' : 'error'"
        variant="outline"
        size="sm"
        class="text-theme-primary bg-theme-secondary"
      >
        {{ checkResults.score }} балів
      </UBadge>
    </div>

    <!-- Test Statistics -->
    <div class="flex items-center justify-between p-2 bg-theme-secondary rounded">
      <span class="text-xs font-medium text-theme-primary">Статистика тестів:</span>
      <div class="flex items-center gap-2">
        <UBadge v-if="fullPassedTests > 0" color="success" variant="subtle" size="xs">
          {{ fullPassedTests }} пройдено
        </UBadge>
        <UBadge v-if="fullFailedTests > 0" color="error" variant="subtle" size="xs">
          {{ fullFailedTests }} не пройдено
        </UBadge>
      </div>
    </div>

    <!-- Lint Errors -->
    <div v-if="checkResults.lint.length > 0">
      <h3 class="text-xs font-semibold text-theme-primary mb-2">Помилки коду</h3>
      <div class="space-y-1 max-h-24 overflow-y-auto">
        <div
          v-for="(error, index) in checkResults.lint"
          :key="index"
          class="flex items-start gap-1 p-1 bg-error border border-error rounded text-xs"
        >
          <UIcon 
            :name="error.severity === 2 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-exclamation-circle'"
            class="h-2 w-2 text-error mt-0.5 flex-shrink-0"
          />
          <div class="flex-1">
            <p class="font-medium text-error text-xs">{{ error.message }}</p>
            <p class="text-error-light text-xs">Рядок {{ error.line }}, колонка {{ error.column }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Results Tabs -->
    <div>
      <h3 class="text-xs font-semibold text-theme-primary mb-2">Результати тестів</h3>
      
      <!-- Test Result Tabs -->
      <div class="flex items-center gap-1 mb-3 flex-wrap">
        <button
          v-for="(test, index) in checkResults.tests"
          :key="index"
          @click="$emit('update:selectedResultIndex', index)"
          class="px-3 py-1 text-xs rounded-full transition-colors"
          :class="selectedResultIndex === index 
            ? (test.passed ? 'bg-green-700 text-white' : 'bg-red-700 text-white')
            : (test.passed ? 'bg-green-200 text-green-700 hover:bg-green-300' : 'bg-red-200 text-red-700 hover:bg-red-300')"
        >
          Тест {{ index + 1 }}
        </button>
      </div>

      <!-- Test Result Content -->
      <div v-if="selectedResultIndex >= 0 && checkResults.tests[selectedResultIndex]">
        <div 
          class="border rounded p-3"
          :class="checkResults.tests[selectedResultIndex].passed ? 'border-success bg-success' : 'border-error bg-error'"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-theme-primary">{{ checkResults.tests[selectedResultIndex].description }}</span>
            <UBadge 
              :color="checkResults.tests[selectedResultIndex].passed ? 'success' : 'error'"
              variant="solid"
              size="xs"
            >
              {{ checkResults.tests[selectedResultIndex].passed ? '✓' : '✗' }}
            </UBadge>
          </div>
          
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-theme-secondary">Вхід:</span>
              <span class="font-mono text-theme-primary">{{ checkResults.tests[selectedResultIndex].input }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-theme-secondary">Очікувано:</span>
              <span class="font-mono text-theme-primary">{{ checkResults.tests[selectedResultIndex].expected }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-theme-secondary">Отримано:</span>
              <span class="font-mono" :class="checkResults.tests[selectedResultIndex].passed ? 'text-green-600' : 'text-red-600'">
                {{ checkResults.tests[selectedResultIndex].actual }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  checkResults?: any
  selectedResultIndex: number
  fullTestResults?: any
}

interface Emits {
  (e: 'update:selectedResultIndex', value: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const fullPassedTests = computed(() => {
  if (!props.fullTestResults?.tests) return 0
  return props.fullTestResults.tests.filter((test: any) => test.passed).length
})

const fullFailedTests = computed(() => {
  if (!props.fullTestResults?.tests) return 0
  return props.fullTestResults.tests.filter((test: any) => !test.passed).length
})
</script> 