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
    
    <UiBaseButton
      v-if="isAuthenticated"
      variant="ghost"
      size="sm"
      icon="i-heroicons-paper-airplane"
      custom-class="text-theme-primary hover:bg-theme-hover"
      @click="$emit('submit')"
    >
      Здати
    </UiBaseButton>
    
    <UiBaseButton
      v-else
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
}

interface Emits {
  (e: 'view'): void
  (e: 'submit'): void
  (e: 'login'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 