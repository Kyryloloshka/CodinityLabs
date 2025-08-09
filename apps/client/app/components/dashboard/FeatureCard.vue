<template>
  <div class="group h-full relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover-lift">
    <div class="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300" :style="{ background: gradientColors }"></div>
    
    <div class="relative p-6 flex flex-col h-full">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md" :style="{ background: gradientColors }">
          {{ icon }}
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-auto">
        {{ description }}
      </p>
      
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in tags" 
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r" :style="{ background: gradientColors }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  description: string
  icon: string
  gradientColors: string
  tags: string[]
}

defineProps<Props>()
</script>