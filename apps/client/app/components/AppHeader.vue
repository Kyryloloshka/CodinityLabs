<template>
  <header class="bg-theme-card shadow-md border-b border-theme-primary transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-1">
        <div class="flex items-center">
          <UIcon name="i-heroicons-academic-cap" class="h-6 w-6 text-accent-primary" />
          <h1 class="ml-2 text-lg font-bold text-theme-primary">
            Система управління завданнями
          </h1>
        </div>
        
        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
          <ThemeSwitcher />
          <div class="text-xs text-theme-secondary">
            <span class="font-medium text-theme-primary">{{ authStore.user?.name }}</span>
            <span class="mx-1">•</span>
            <span class="text-theme-muted">{{ getRoleLabel(authStore.user?.role) }}</span>
          </div>
          <UButton
            variant="ghost"
            size="sm"
            :loading="isLoggingOut"
            @click="handleLogout"
            class="text-theme-primary cursor-pointer hover:bg-theme-hover"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-3 w-3" />
            Вийти
          </UButton>
        </div>
        <div v-else class="flex items-center space-x-2">
          <ThemeSwitcher />
          <UButton
            to="/login"
            variant="ghost"
            size="sm"
            class="text-theme-primary cursor-pointer"
          >
            Увійти
          </UButton>
          <UButton
            to="/register"
            variant="ghost"
            size="sm"
            class="text-theme-primary cursor-pointer"
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