<template>
  <LayoutAppLoader v-if="!authStore.isInitialized" />
  <slot v-else />
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script> 