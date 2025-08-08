<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-theme-primary">
        {{ title }}
      </h2>
      <div v-if="showLoginButton && !isAuthenticated" class="flex space-x-2">
        <UiBaseButton
          to="/login"
          variant="solid"
          color="primary"
          size="sm"
          icon="i-heroicons-arrow-right-on-rectangle"
        >
          Увійти для подання
        </UiBaseButton>
      </div>
    </div>

    <UiLoadingSpinner 
      v-if="loading" 
      message="Завантаження завдань..." 
    />

    <UiErrorMessage 
      v-else-if="error" 
      :message="error" 
    />

    <div v-else-if="assignments.length > 0" class="grid gap-4">
      <AssignmentCard
        v-for="assignment in assignments"
        :key="assignment.id"
        :assignment="assignment"
        :is-authenticated="isAuthenticated"
        @view="$emit('view', assignment)"
        @submit="$emit('submit', assignment)"
        @login="$emit('login', assignment)"
      />
    </div>

    <UiEmptyState
      v-else
      icon="i-heroicons-document-text"
      :title="emptyStateTitle"
      :description="emptyStateDescription"
    />
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from '~/lib/types'

interface Props {
  assignments: Assignment[]
  loading: boolean
  error: string
  isAuthenticated: boolean
  title?: string
  showLoginButton?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
}

interface Emits {
  (e: 'view', assignment: Assignment): void
  (e: 'submit', assignment: Assignment): void
  (e: 'login', assignment: Assignment): void
}

withDefaults(defineProps<Props>(), {
  title: 'Публічні завдання',
  showLoginButton: true,
  emptyStateTitle: 'Немає публічних завдань',
  emptyStateDescription: 'Зачекайте поки викладачі створять публічні завдання'
})

defineEmits<Emits>()
</script> 