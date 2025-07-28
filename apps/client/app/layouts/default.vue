<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <AppNavigation />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout за замовчуванням з хедером та навігацією
</script> 