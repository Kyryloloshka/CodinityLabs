<template>
  <div class="min-h-screen bg-theme-primary transition-colors duration-300">
    <AppLoader v-if="!authStore.isInitialized" />
    
    <template v-else>
      <AppHeader />
      
      <AppNavigation />

      <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script> 