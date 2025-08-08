<template>
  <div class="bg-error border border-error rounded p-3">
    <div class="flex">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-error" />
      <div class="ml-2">
        <h3 class="text-xs font-medium text-error">{{ title }}</h3>
        <p class="mt-1 text-xs text-error-light">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message: string
}

withDefaults(defineProps<Props>(), {
  title: 'Помилка'
})
</script> 