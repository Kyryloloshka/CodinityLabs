<template>
  <div class="min-h-screen bg-theme-primary transition-colors duration-300">
    <!-- Показуємо завантажувальний екран поки авторизація не ініціалізується -->
    <AppLoader v-if="!authStore.isInitialized" />
    
    <!-- Показуємо основний контент тільки після ініціалізації -->
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
// Layout за замовчуванням з хедером та навігацією
const authStore = useAuthStore()
</script> 