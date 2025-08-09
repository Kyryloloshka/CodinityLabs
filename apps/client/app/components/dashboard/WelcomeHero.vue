<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 rounded-2xl shadow-2xl">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="w-full h-full bg-pattern"></div>
    </div>
    
    <div class="relative px-8 py-12 md:px-12 md:py-16">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <!-- Main heading -->
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Зміни своє
            <span class="bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-200 dark:to-orange-200 bg-clip-text text-transparent">
              Codinity
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Платформа для навчання програмування з автоматичною перевіркою коду та миттєвим зворотним зв'язком
          </p>
          
          <!-- Features badges -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <div class="flex items-center bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <span class="mr-2">🚀</span>
              <span class="text-sm font-medium">Миттєва перевірка</span>
            </div>
            <div class="flex items-center bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <span class="mr-2">📊</span>
              <span class="text-sm font-medium">Детальна аналітика</span>
            </div>
            <div class="flex items-center bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <span class="mr-2">🎯</span>
              <span class="text-sm font-medium">Персоналізоване навчання</span>
            </div>
          </div>
          
          <!-- Call to action -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <!-- For non-authenticated users -->
            <template v-if="!isAuthenticated">
              <NuxtLink 
                to="/register"
                class="inline-flex items-center px-8 py-3 bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span class="mr-2">📝</span>
                Почати навчання
              </NuxtLink>
              <NuxtLink 
                to="/assignments"
                class="inline-flex items-center px-8 py-3 bg-white/10 dark:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-200 border border-white/20 dark:border-white/30"
              >
                <span class="mr-2">📚</span>
                Переглянути завдання
              </NuxtLink>
            </template>

            <!-- For authenticated users -->
            <template v-else>
              <NuxtLink 
                to="/assignments"
                class="inline-flex items-center px-8 py-3 bg-white/10 dark:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-200 border border-white/20 dark:border-white/30"
              >
                <span class="mr-2">📚</span>
                Завдання
              </NuxtLink>
              
              <!-- For students -->
              <template v-if="userRole === 'STUDENT'">
                <NuxtLink 
                  to="/profile"
                  class="inline-flex items-center px-8 py-3 bg-white/10 dark:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-200 border border-white/20 dark:border-white/30"
                >
                  <span class="mr-2">👤</span>
                  Профіль
                </NuxtLink>
              </template>
              
              <!-- For teachers -->
              <template v-if="userRole === 'TEACHER'">
                <NuxtLink 
                  to="/assignments/create"
                  class="inline-flex items-center px-8 py-3 bg-white/10 dark:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-200 border border-white/20 dark:border-white/30"
                >
                  <span class="mr-2">➕</span>
                  Створити завдання
                </NuxtLink>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom decoration -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 dark:from-yellow-200 dark:via-orange-200 dark:to-red-200"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isAuthenticated: boolean
  userRole?: string | null
}

defineProps<Props>()
</script>