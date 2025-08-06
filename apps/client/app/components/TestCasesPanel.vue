<template>
  <div v-if="assignment" class="mb-4">
    <div class="flex items-center gap-1 mb-3 flex-wrap">
      <button
        v-for="(testCase, index) in assignment.testCases"
        :key="testCase.id"
        @click="$emit('update:selectedTestCaseIndex', index)"
        class="px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1"
        :class="selectedTestCaseIndex === index 
          ? 'bg-theme-primary text-theme-primary' 
          : 'bg-theme-tertiary text-theme-primary hover:bg-theme-hover'"
      >
        Випадок {{ index + 1 }}
      </button>
    </div>

    <div v-if="selectedTestCaseIndex >= 0 && assignment.testCases[selectedTestCaseIndex]">
      <div class="flex items-center gap-2 mb-3">
        <div v-if="assignment.testCases[selectedTestCaseIndex].description" class="text-sm text-theme-secondary">
          <span class="text-theme-secondary">Опис:{{ ' ' }}</span>
          <span class="text-theme-primary">{{ assignment.testCases[selectedTestCaseIndex].description }}</span>
        </div>
      </div>
      <div class="border border-theme-primary rounded p-3 bg-theme-secondary">
        <div class="space-y-2 text-xs">
          <div>
            <span class="text-theme-secondary">Вхід:</span>
            <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono mt-1 text-xs text-theme-primary">{{ assignment.testCases[selectedTestCaseIndex].input }}</div>
          </div>
          <div>
            <span class="text-theme-secondary">Очікуваний результат:</span>
            <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono mt-1 text-xs text-theme-primary">{{ assignment.testCases[selectedTestCaseIndex].expected }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignment?: any
  selectedTestCaseIndex: number
}

interface Emits {
  (e: 'update:selectedTestCaseIndex', value: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 