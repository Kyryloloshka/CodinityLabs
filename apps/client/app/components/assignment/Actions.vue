<template>
  <div class="flex items-center gap-1 ml-3">
    <UiBaseButton
      variant="ghost"
      size="sm"
      icon="i-heroicons-eye"
      custom-class="text-theme-primary hover:bg-theme-hover"
      @click="$emit('view')"
    >
      Переглянути
    </UiBaseButton>
    
    <!-- Дії для студентів -->
    <template v-if="isAuthenticated && userRole === 'STUDENT'">
      <UiBaseButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-paper-airplane"
        custom-class="text-theme-primary hover:bg-theme-hover"
        @click="$emit('submit')"
      >
        Здати
      </UiBaseButton>
    </template>
    
    <!-- Дії для викладачів -->
    <template v-if="isAuthenticated && userRole === 'TEACHER'">
      <UiBaseButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-pencil"
        custom-class="text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
        @click="$emit('edit')"
      >
        Редагувати
      </UiBaseButton>
    </template>
    
    <!-- Кнопка для неавторизованих -->
    <UiBaseButton
      v-if="!isAuthenticated"
      variant="solid"
      color="primary"
      size="sm"
      icon="i-heroicons-arrow-right-on-rectangle"
      @click="$emit('login')"
    >
      Увійти
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isAuthenticated: boolean
  userRole?: string | null
}

interface Emits {
  (e: 'view'): void
  (e: 'submit'): void
  (e: 'edit'): void
  (e: 'login'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 