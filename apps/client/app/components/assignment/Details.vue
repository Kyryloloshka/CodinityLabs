<template>
  <div class="space-y-6">
    <div class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
      <h2 class="text-xl font-semibold text-theme-primary mb-4">Опис завдання</h2>
      <div class="prose max-w-none">
        <p class="text-theme-primary whitespace-pre-wrap">{{ assignment.description }}</p>
        
        <div v-if="assignment.settings && showSettings" class="mt-4 pt-4 border-t border-theme-secondary">
          <div class="flex flex-wrap gap-4 text-sm text-theme-secondary">
            <span>⏱ {{ (assignment.settings.timeout / 1000).toFixed(1) }}с</span>
            <span>📝 {{ assignment.settings.maxAttempts === null ? 'Необмежено подань' : `Макс. ${assignment.settings.maxAttempts} подань` }}</span>
            <span>📊 {{ assignment.settings.passingThreshold }}% для проходження</span>
            <span>{{ assignment.settings.allowPartialScore ? '✅' : '❌' }} часткові бали</span>
            <span>{{ assignment.settings.strictMode ? '🔒' : '🔓' }} {{ assignment.settings.strictMode ? 'строгий' : 'звичайний' }} режим</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-theme-card shadow rounded-lg p-6 border border-theme-primary">
      <h2 class="text-xl font-semibold text-theme-primary mb-4">Тестові випадки</h2>
      <div class="grid gap-4">
        <div
          v-for="(testCase, index) in assignment.testCases"
          :key="testCase.id"
          class="border border-theme-primary rounded-lg p-4 bg-theme-secondary"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-theme-primary">Тест {{ index + 1 }}</h3>
            <UBadge color="primary" variant="subtle">Тестовий випадок</UBadge>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label class="block text-sm font-medium text-theme-secondary mb-1">Опис</label>
              <div class="bg-theme-input p-2 rounded border border-theme-primary text-theme-primary">{{ testCase.description }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-theme-secondary mb-1">Вхідні дані</label>
              <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono text-theme-primary">{{ testCase.input }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-theme-secondary mb-1">Очікуваний результат</label>
              <div class="bg-theme-input p-2 rounded border border-theme-primary font-mono text-theme-primary">{{ testCase.expected }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  assignment: any
  showSettings?: boolean
}

withDefaults(defineProps<Props>(), {
  showSettings: false
})
</script> 