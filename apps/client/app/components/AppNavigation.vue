<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              to="/"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-indigo-500 text-gray-900"
            >
              Дашборд
            </NuxtLink>
            <NuxtLink
              to="/assignments"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-indigo-500 text-gray-900"
            >
              Завдання
            </NuxtLink>
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/profile"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-indigo-500 text-gray-900"
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
</script> 