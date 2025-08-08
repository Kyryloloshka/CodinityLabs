<template>
  <div>
    <TestCasesPanel
      v-if="activeTab === 'testCases'"
      :assignment="assignment"
      :selected-test-case-index="selectedTestCaseIndex"
      @update:selected-test-case-index="$emit('update:selectedTestCaseIndex', $event)"
    />

    <ResultsTestPanel
      v-else-if="activeTab === 'results'"
      :check-results="checkResults"
      :selected-result-index="selectedResultIndex"
      @update:selected-result-index="$emit('update:selectedResultIndex', $event)"
    />

    <SubmissionHistory
      v-else-if="activeTab === 'history'"
      :submissions="submissions || []"
      :loading="historyLoading"
      :error="historyError"
      @refresh="$emit('refresh-history')"
      @select-submission="$emit('select-submission', $event)"
    />

    <div v-else-if="activeTab === 'testCases' && !assignment" class="text-center py-8">
      <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-theme-muted mx-auto mb-2" />
      <p class="text-theme-secondary text-xs">Завантаження тестових випадків...</p>
    </div>

    <div v-else-if="activeTab === 'results' && !checkResults" class="text-center py-8">
      <UIcon name="i-heroicons-play-circle" class="h-8 w-8 text-theme-muted mx-auto mb-2" />
      <p class="text-theme-secondary text-xs">Натисніть "Перевірити" щоб запустити тести</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string
  assignment?: any
  checkResults?: any
  selectedTestCaseIndex: number
  selectedResultIndex: number
  submissions?: any[]
  historyLoading?: boolean
  historyError?: string
}

interface Emits {
  (e: 'update:selectedTestCaseIndex', value: number): void
  (e: 'update:selectedResultIndex', value: number): void
  (e: 'refresh-history'): void
  (e: 'select-submission', submission: any): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 