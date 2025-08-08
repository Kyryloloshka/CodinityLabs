<template>
  <UiBaseCard>
    <div class="px-4 py-3">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <AssignmentHeader :assignment="assignment" />
          
          <p class="text-sm text-theme-secondary mb-3 line-clamp-2">
            {{ assignment.description }}
          </p>
          
          <AssignmentMeta :assignment="assignment" />
        </div>
        
        <AssignmentActions 
          :is-authenticated="isAuthenticated"
          @view="$emit('view')"
          @submit="$emit('submit')"
          @login="$emit('login')"
        />
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import type { Assignment } from '~/lib/types'

interface Props {
  assignment: Assignment
  isAuthenticated: boolean
}

interface Emits {
  (e: 'view'): void
  (e: 'submit'): void
  (e: 'login'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 