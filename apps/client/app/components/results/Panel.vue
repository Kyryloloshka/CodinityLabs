<template>
  <div class="w-full h-full bg-theme-card overflow-y-auto transition-colors duration-300">
    <div class="p-4">
      <ResultsTabs 
        :active-tab="activeTab"
        :check-results="checkResults"
        @update:active-tab="$emit('update:activeTab', $event)"
      />

      <ResultsContent
        :active-tab="activeTab"
        :assignment="assignment"
        :check-results="checkResults"
        :selected-test-case-index="selectedTestCaseIndex"
        :selected-result-index="selectedResultIndex"
        :submissions="submissions"
        :history-loading="historyLoading"
        :history-error="historyError"
        @update:selected-test-case-index="$emit('update:selectedTestCaseIndex', $event)"
        @update:selected-result-index="$emit('update:selectedResultIndex', $event)"
        @refresh-history="$emit('refresh-history')"
        @select-submission="$emit('select-submission', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignment?: any
  checkResults?: any
  activeTab: string
  selectedTestCaseIndex: number
  selectedResultIndex: number
  testing?: boolean
  totalTests?: number
  submissions?: any[]
  historyLoading?: boolean
  historyError?: string
}

interface Emits {
  (e: 'update:activeTab', value: string): void
  (e: 'update:selectedTestCaseIndex', value: number): void
  (e: 'update:selectedResultIndex', value: number): void
  (e: 'refresh-history'): void
  (e: 'select-submission', submission: any): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 