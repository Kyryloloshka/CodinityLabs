<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 hover-lift">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-lg font-bold shadow-sm" :style="{ background: gradientColors }">
          {{ icon }}
        </div>
        <h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ label }}
        </p>
      </div>
    </div>
    
    <div class="space-y-2">
      <div v-for="(item, index) in items" :key="index" class="flex justify-between items-center text-sm">
        <span class="text-gray-600 dark:text-gray-300">{{ item.label }}</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatItem {
  label: string
  value: string | number
}

interface Props {
  title: string
  value: string | number
  label: string
  icon: string
  gradientColors: string
  items: StatItem[]
}

defineProps<Props>()
</script>