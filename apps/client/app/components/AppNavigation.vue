<template>
  <nav class="bg-theme-card border-b border-theme-primary transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-10">
        <div class="flex">
          <div class="hidden sm:ml-6 sm:flex sm:space-x-6">
            <NuxtLink
              to="/"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-xs font-medium transition-colors duration-200',
                $route.path === '/' 
                  ? 'border-accent-primary text-theme-primary' 
                  : 'border-transparent text-theme-secondary hover:border-theme-secondary hover:text-theme-primary'
              ]"
            >
              Дашборд
            </NuxtLink>
            <NuxtLink
              to="/assignments"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-xs font-medium transition-colors duration-200',
                $route.path.startsWith('/assignments') 
                  ? 'border-accent-primary text-theme-primary' 
                  : 'border-transparent text-theme-secondary hover:border-theme-secondary hover:text-theme-primary'
              ]"
            >
              Завдання
            </NuxtLink>
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/profile"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-xs font-medium transition-colors duration-200',
                $route.path === '/profile' 
                  ? 'border-accent-primary text-theme-primary' 
                  : 'border-transparent text-theme-secondary hover:border-theme-secondary hover:text-theme-primary'
              ]"
            >
              Профіль
            </NuxtLink>
          </div>
        </div>
        
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const $route = useRoute()
</script> 