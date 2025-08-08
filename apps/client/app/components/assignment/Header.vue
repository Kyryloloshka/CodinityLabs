<template>
  <div class="flex items-center gap-2 mb-2">
    <h3 class="text-base font-semibold text-theme-primary">
      {{ assignment.title }}
    </h3>
    <UBadge
      color="secondary"
      variant="subtle"
    >
      Складність: {{ assignment.difficulty }}/10
    </UBadge>
    <UBadge
      :color="isAssignmentActive ? 'success' : 'error'"
      variant="subtle"
    >
      {{ isAssignmentActive ? 'Активне' : 'Завершене' }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from '~/lib/types'

interface Props {
  assignment: Assignment
}

const props = defineProps<Props>()

const isAssignmentActive = computed(() => {
  const now = new Date()
  const deadline = new Date(props.assignment.deadline)
  return deadline > now
})
</script> 