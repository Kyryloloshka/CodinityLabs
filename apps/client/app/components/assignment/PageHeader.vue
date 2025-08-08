<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-theme-primary">
      {{ title }}
    </h1>
    <p class="mt-2 text-theme-secondary">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script> 