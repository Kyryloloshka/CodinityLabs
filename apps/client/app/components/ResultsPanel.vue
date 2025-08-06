<template>
  <div class="w-full h-full bg-theme-card overflow-y-auto transition-colors duration-300">
    <div class="p-4">
      <!-- Main Tabs -->
      <div class="flex items-center border-b border-theme-primary mb-4">
        <button
          @click="$emit('update:activeTab', 'testCases')"
          class="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'testCases' 
            ? 'text-theme-primary border-b-2 border-theme-primary' 
            : 'text-theme-secondary hover:text-theme-primary'"
        >
          <UIcon name="i-heroicons-check-circle" class="h-3 w-3" />
          Тестові випадки
        </button>
        <button
          v-if="checkResults"
          @click="$emit('update:activeTab', 'results')"
          class="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'results' 
            ? 'text-theme-primary border-b-2 border-theme-primary' 
            : 'text-theme-secondary hover:text-theme-primary'"
        >
          <UIcon name="i-heroicons-chart-bar" class="h-3 w-3" />
          Результати
        </button>
      </div>

      <!-- Test Cases Tab Content -->
      <TestCasesPanel
        v-if="activeTab === 'testCases'"
        :assignment="assignment"
        :selected-test-case-index="selectedTestCaseIndex"
        @update:selected-test-case-index="$emit('update:selectedTestCaseIndex', $event)"
      />

      <!-- Results Tab Content -->
      <TestResultsPanel
        v-else-if="activeTab === 'results'"
        :check-results="checkResults"
        :selected-result-index="selectedResultIndex"
        :full-test-results="fullTestResults"
        @update:selected-result-index="$emit('update:selectedResultIndex', $event)"
      />

      <!-- Empty State -->
      <div v-else-if="activeTab === 'testCases' && !assignment" class="text-center py-8">
        <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-theme-muted mx-auto mb-2" />
        <p class="text-theme-secondary text-xs">Завантаження тестових випадків...</p>
      </div>

      <div v-else-if="activeTab === 'results' && !checkResults" class="text-center py-8">
        <UIcon name="i-heroicons-play-circle" class="h-8 w-8 text-theme-muted mx-auto mb-2" />
        <p class="text-theme-secondary text-xs">Натисніть "Перевірити" щоб запустити тести</p>
      </div>
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
  fullTestResults?: any
  testing?: boolean
  totalTests?: number
}

interface Emits {
  (e: 'update:activeTab', value: string): void
  (e: 'update:selectedTestCaseIndex', value: number): void
  (e: 'update:selectedResultIndex', value: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 