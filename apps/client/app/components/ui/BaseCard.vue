<template>
  <div 
    class="bg-theme-card overflow-hidden shadow rounded hover:shadow-md transition-shadow border border-theme-primary"
    :class="[customClass]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  customClass?: string
}

defineProps<Props>()
</script> 