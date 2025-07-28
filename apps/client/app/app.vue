<style>
@import "./assets/css/tailwind.css";
</style>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppLoader v-if="!authStore.isInitialized" />
    
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>
