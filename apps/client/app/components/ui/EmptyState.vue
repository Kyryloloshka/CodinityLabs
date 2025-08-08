<template>
  <div class="text-center py-8">
    <UIcon :name="icon" class="mx-auto h-8 w-8 text-theme-muted" />
    <h3 class="mt-2 text-sm font-medium text-theme-primary">{{ title }}</h3>
    <p class="mt-1 text-xs text-theme-secondary">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script> 