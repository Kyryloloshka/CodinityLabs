<template>
  <div class="flex justify-center py-8">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
      <p v-if="message" class="mt-2 text-xs text-theme-secondary">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Завантаження...'
})
</script> 