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
        <UBadge v-if="checkResults.testStats?.passed > 0" color="success" variant="subtle" size="sm">
          {{ checkResults.testStats.passed }} пройдено
        </UBadge>
        <UBadge v-if="checkResults.testStats?.failed > 0" color="error" variant="subtle" size="sm">
          {{ checkResults.testStats.failed }} не пройдено
        </UBadge>
        <UBadge v-if="checkResults.testStats?.timeout > 0" color="warning" variant="subtle" size="sm">
          {{ checkResults.testStats.timeout }} таймаут
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
      <h3 class="text-xs font-semibold text-theme-primary mb-2">Результати тестів (публічні)</h3>
      
      <!-- Test Result Tabs -->
      <div class="flex items-center gap-1 mb-3 flex-wrap">
        <button
          v-for="(test, index) in checkResults.tests"
          :key="index"
          @click="$emit('update:selectedResultIndex', index)"
          class="px-3 py-1 text-xs rounded-full transition-colors"
          :class="selectedResultIndex === index 
            ? (test.passed ? 'bg-success text-success-light' : test.timeout ? 'bg-warning text-warning-light' : 'bg-error text-error-light')
            : (test.passed ? 'bg-success/20 text-success hover:bg-success/30' : test.timeout ? 'bg-warning/20 text-warning hover:bg-warning/30' : 'bg-error/20 text-error hover:bg-error/30')"
        >
          Тест {{ index + 1 }}
        </button>
      </div>

      <!-- Test Result Content -->
      <div v-if="selectedResultIndex >= 0 && checkResults.tests[selectedResultIndex]">
        <div 
          class="border rounded p-3"
          :class="checkResults.tests[selectedResultIndex].passed 
            ? 'border-success bg-success' 
            : checkResults.tests[selectedResultIndex].timeout 
              ? 'border-warning bg-warning' 
              : 'border-error bg-error'"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-theme-primary">{{ checkResults.tests[selectedResultIndex].description }}</span>
            <UBadge 
              :color="checkResults.tests[selectedResultIndex].passed ? 'success' : checkResults.tests[selectedResultIndex].timeout ? 'warning' : 'error'"
              variant="solid"
              size="xs"
            >
              {{ checkResults.tests[selectedResultIndex].passed ? '✓' : checkResults.tests[selectedResultIndex].timeout ? '⏱' : '✗' }}
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
              <span class="font-mono" 
                :class="checkResults.tests[selectedResultIndex].passed 
                  ? 'text-success' 
                  : checkResults.tests[selectedResultIndex].timeout 
                    ? 'text-warning' 
                    : 'text-error'">
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
}

interface Emits {
  (e: 'update:selectedResultIndex', value: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Видаляємо старі computed властивості, оскільки тепер використовуємо testStats з API
</script> 