<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <UIcon name="i-heroicons-academic-cap" class="h-8 w-8 text-indigo-600" />
          <h1 class="ml-3 text-2xl font-bold text-gray-900">
            Система управління завданнями
          </h1>
        </div>
        
        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
          <div class="text-sm text-gray-700">
            <span class="font-medium">{{ authStore.user?.name }}</span>
            <span class="mx-2">•</span>
            <span class="text-gray-500">{{ getRoleLabel(authStore.user?.role) }}</span>
          </div>
          <UButton
            variant="ghost"
            :loading="isLoggingOut"
            @click="handleLogout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2 h-4 w-4" />
            Вийти
          </UButton>
        </div>
        <div v-else class="flex items-center space-x-4">
          <UButton
            to="/login"
            variant="ghost"
            color="primary"
            size="sm"
          >
            Увійти
          </UButton>
          <UButton
            to="/register"
            variant="solid"
            color="primary"
            size="sm"
          >
            Реєстрація
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
const isLoggingOut = ref(false)

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

const handleLogout = async () => {
  isLoggingOut.value = true
  authStore.logout()
  await router.push('/login')
  isLoggingOut.value = false
}
</script> 