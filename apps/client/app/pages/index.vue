<template>
  <div class="">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-theme-primary">
        {{ authStore.isAuthenticated ? 'Вітаємо!' : 'Ласкаво просимо до системи завдань' }}
      </h1>
      <p class="mt-1 text-sm text-theme-secondary">
        {{ authStore.isAuthenticated 
          ? `Ви увійшли як ${getRoleLabel(authStore.user?.role)}` 
          : 'Переглядайте доступні завдання та увійдіть для подання рішень' 
        }}
      </p>
    </div>
   
    <AssignmentList
      :assignments="assignments"
      :loading="loading"
      :error="error"
      :is-authenticated="authStore.isAuthenticated"
      @view="handleAssignmentAction($event, 'view')"
      @submit="handleAssignmentAction($event, 'submit')"
      @login="handleAssignmentAction($event, 'login')"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'redirect-after-auth'
})

const authStore = useAuthStore()
const { assignments, loading, error, loadAssignments, getRoleLabel } = useAssignmentsData()
const { handleAssignmentAction } = useAssignmentActions()

onMounted(() => {
  loadAssignments()
})
</script> 