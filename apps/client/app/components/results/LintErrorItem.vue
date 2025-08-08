<template>
  <div class="border border-theme-primary rounded p-2 mb-2">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-theme-primary">
        Рядок {{ error.line }}, колонка {{ error.column }}
      </span>
      <UBadge
        :color="getSeverityColor(error.severity)"
        variant="subtle"
        size="xs"
      >
        {{ getSeverityLabel(error.severity) }}
      </UBadge>
    </div>
    <p class="text-xs text-theme-secondary mb-1">{{ error.message }}</p>
    <p class="text-xs text-theme-muted">Правило: {{ error.ruleId }}</p>
  </div>
</template>

<script setup lang="ts">
import type { LintError } from '~/lib/types'

interface Props {
  error: LintError
}

defineProps<Props>()

const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 0:
      return 'info'
    case 1:
      return 'warning'
    case 2:
      return 'error'
    default:
      return 'secondary'
  }
}

const getSeverityLabel = (severity: number) => {
  switch (severity) {
    case 0:
      return 'Інфо'
    case 1:
      return 'Попередження'
    case 2:
      return 'Помилка'
    default:
      return 'Невідомо'
  }
}
</script> 