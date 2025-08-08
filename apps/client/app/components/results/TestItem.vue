<template>
  <div class="border border-theme-primary rounded p-3 mb-2">
    <div class="flex items-center justify-between mb-2">
      <h4 class="text-sm font-medium text-theme-primary">
        {{ test.description }}
      </h4>
      <UBadge
        :color="test.passed ? 'success' : 'error'"
        variant="subtle"
        size="xs"
      >
        {{ test.passed ? 'Пройдено' : 'Провалено' }}
      </UBadge>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
      <div>
        <span class="text-theme-muted">Вхідні дані:</span>
        <pre class="mt-1 p-2 bg-theme-secondary rounded text-theme-primary">{{ test.input }}</pre>
      </div>
      <div>
        <span class="text-theme-muted">Очікуваний результат:</span>
        <pre class="mt-1 p-2 bg-theme-secondary rounded text-theme-primary">{{ test.expected }}</pre>
      </div>
      <div>
        <span class="text-theme-muted">Фактичний результат:</span>
        <pre class="mt-1 p-2 bg-theme-secondary rounded text-theme-primary">{{ test.actual }}</pre>
      </div>
    </div>
    
    <div v-if="test.timeout" class="mt-2">
      <UBadge color="warning" variant="subtle" size="xs">
        Таймаут виконання
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TestResult } from '~/lib/types'

interface Props {
  test: TestResult
}

defineProps<Props>()
</script> 