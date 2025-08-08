<template>
  <div class="flex items-center gap-4 text-xs text-theme-muted">
    <div class="flex items-center">
      <UIcon name="i-heroicons-calendar" class="mr-1 h-3 w-3" />
      {{ formatDate(assignment.deadline) }}
    </div>
    <div class="flex items-center">
      <UIcon name="i-heroicons-document-text" class="mr-1 h-3 w-3" />
      {{ assignment._count.submissions }} подань
    </div>
    <div class="flex items-center">
      <UIcon name="i-heroicons-cube" class="mr-1 h-3 w-3" />
      {{ assignment.testCases.length }} тестів
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from '~/lib/types'

interface Props {
  assignment: Assignment
}

defineProps<Props>()

const { formatDate } = useDateUtils()
</script> 