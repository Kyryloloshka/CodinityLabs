<style>
@import "./assets/css/tailwind.css";
</style>

<template>
  <UApp :toaster="{
    position: 'top-right',
    duration: 3000,
  }">
    <div class="min-h-screen bg-theme-primary transition-colors duration-300">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const { initTheme, theme } = useTheme()

onMounted(() => {
  initTheme()
  
  // Додатково перевіряємо тему через невеликий проміжок
  setTimeout(() => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', theme.value)
      // Принудово оновлюємо всі елементи
      document.body.style.backgroundColor = ''
      document.body.style.backgroundColor = 'var(--bg-primary)'
    }
  }, 50)
  
  // Ще один перевір через більший проміжок
  setTimeout(() => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  }, 200)
})
</script>
