<template>
  <!-- Показуємо завантажувальний екран поки авторизація не ініціалізується -->
  <AppLoader v-if="!authStore.isInitialized" />
  
  <!-- Показуємо основний контент тільки після ініціалізації -->
  <slot v-else />
</template>

<script setup lang="ts">
// Layout для сторінок авторизації без хедера та навігації
const authStore = useAuthStore()
</script> 