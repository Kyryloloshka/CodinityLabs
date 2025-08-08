<template>
  <div class="flex items-center space-x-3">
    <ThemeSwitcher />
    <div class="text-xs text-theme-secondary">
      <span class="font-medium text-theme-primary">{{ user?.name }}</span>
      <span class="mx-1">•</span>
      <span class="text-theme-muted">{{ getRoleLabel(user?.role) }}</span>
    </div>
    <UButton
      variant="ghost"
      size="sm"
      :loading="isLoggingOut"
      @click="$emit('logout')"
      class="text-theme-primary cursor-pointer hover:bg-theme-hover"
    >
      <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-1 h-3 w-3" />
      Вийти
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  user?: any
  isLoggingOut?: boolean
}

interface Emits {
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()

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