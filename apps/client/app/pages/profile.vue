<template>
  <div class="">
    <div class="bg-theme-card overflow-hidden shadow rounded-lg border border-theme-primary">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-theme-tertiary flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="h-6 w-6 text-accent-primary" />
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-theme-primary">
              Вітаємо, {{ authStore.user?.name }}!
            </h2>
            <p class="text-sm text-theme-secondary">
              Ви увійшли як {{ getRoleLabel(authStore.user?.role) }}
            </p>
          </div>
        </div>
        
        <div class="mt-6 border-t border-theme-primary pt-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Email</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ authStore.user?.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Роль</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ getRoleLabel(authStore.user?.role) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">ID користувача</dt>
              <dd class="mt-1 text-sm text-theme-primary">{{ authStore.user?.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-theme-secondary">Статус</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-primary text-theme-primary">
                  Активний
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()

const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'STUDENT':
      return 'Студент'
    case 'TEACHER':
      return 'Викладач'
    default:
      return 'Невідома роль'
  }
}
</script> 