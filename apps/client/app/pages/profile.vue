<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-lg font-medium text-gray-900">
              Вітаємо, {{ authStore.user?.name }}!
            </h2>
            <p class="text-sm text-gray-500">
              Ви увійшли як {{ getRoleLabel(authStore.user?.role) }}
            </p>
          </div>
        </div>
        
        <div class="mt-6 border-t border-gray-200 pt-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Роль</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ getRoleLabel(authStore.user?.role) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">ID користувача</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Статус</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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